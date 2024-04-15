import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Dialog, Portal, TextInput, Text, Card } from 'react-native-paper';
import { useFetchCurrentUserProfile } from "../hooks/useFetchCurrentUserProfile";
import { addComment } from '../hooks/comments/utils/addComment'
import softDeleteComment from '../../Helip/hooks/comments/utils/deleteComment'
import softDeleteReply from '../hooks/comments/utils/deleteReply';
import { addReplyToComment } from '../hooks/comments/utils/addReplyToComment';
import formatDateAndTime from '../../Helip/utils/formatDateAndTime';
import { findQuoteForReply } from '../utils/findQuoteForReply';
import useAuth from '../hooks/useAuth';
export const CommentsDialog = ({ visible, setDialogVisible, onDismiss, eventId }) => {

    const [value, setValue] = React.useState({
        comment: "",
        eventId: eventId,
    });

    const { currentUser } = useAuth();
    const userId = currentUser?.uid;
    const { profile } = useFetchCurrentUserProfile();

    const handleAddComment = () => {

        Alert.alert(
            "Confirm",
            "Are you sure you want to send this comment?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes", onPress: () => {
                        addCommentToFirestore();
                        setValue({ comment: "" });
                        setDialogVisible(false)
                    }
                }
            ]
        );
    };


    const addCommentToFirestore = async () => {
        const commentData = {
            comment: value.comment,
            eventId: eventId,

        };

        const success = await addComment(commentData, userId, eventId, profile.displayName, profile.firstName);

        if (success) {

        } else {
            console.log("Failed to add the comment");
        }
    };


    return (

        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss} style={{ marginBottom: 110 }}>
                <Dialog.Title>Add a Comment</Dialog.Title>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <Dialog.Content>
                        <TextInput
                            label="Comment"
                            value={value.comment}
                            onChangeText={(text) => {
                                setValue({ ...value, comment: text })
                            }}

                            mode="outlined"

                        />
                    </Dialog.Content>
                </KeyboardAvoidingView>
                <Dialog.Actions>
                    <Button onPress={onDismiss}>Cancel</Button>
                    <Button onPress={handleAddComment}>Post</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export const ReplyDialog = ({ visible, onDismiss, commentId, targetReplyId, setRepliesVisible, selectedDisplayName, selectedReplyDisplayName, selectedComment, allComments }) => {
    const [value, setValue] = React.useState({
        reply: "",
    });

    const { currentUser } = useAuth();
    const userId = currentUser?.uid;
    const { profile } = useFetchCurrentUserProfile();

    const handleReply = () => {

        Alert.alert(
            "Confirm",
            "Are you sure you want to send this reply?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes", onPress: () => {
                        addReplyToFirestore();
                        setValue({ reply: "" });
                        setRepliesVisible(false)
                    }
                }
            ]
        );
    };


    const addReplyToFirestore = async () => {

        const replyData = {
            reply: value.reply,
        };

        try {
            const success = await addReplyToComment(replyData, userId, profile.displayName, profile.firstName, commentId, targetReplyId);
            if (success) {
                console.log("Reply added successfully!");
            } else {
                console.error("Failed to add the reply");
            }
        } catch (error) {
            console.error("Error during addReplyToComment:", error);
        }

    };


    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss} style={{ marginBottom: 135 }}>
                {
                    targetReplyId && targetReplyId !== commentId ?
                        <>
                            <Dialog.Title>Reply to {selectedReplyDisplayName}</Dialog.Title>
                            <Text style={{ marginLeft: 20, marginBottom: 10, fontStyle: 'italic', color: "gray" }}>who said: "{findQuoteForReply(targetReplyId, allComments)}"
                            </Text>
                        </>
                        :
                        <>
                            <Dialog.Title>Reply to {selectedDisplayName}</Dialog.Title>
                            <Text style={{ marginLeft: 20, marginBottom: 10, fontStyle: 'italic', color: "gray" }}>who said: "{selectedComment}"
                            </Text>
                        </>
                }
                <Dialog.Content>
                    <TextInput
                        label="Reply"
                        value={value.reply}
                        onChangeText={(text) => {
                            setValue({ ...value, reply: text })
                        }}

                        mode="outlined"

                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onDismiss}>Cancel</Button>
                    <Button onPress={handleReply}>Post</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export const CommentsView = ({ comments, eventId, currentUser }) => {
    const [repliesVisible, setRepliesVisible] = useState(false);
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [selectedTargetReplyId, setSelectedTargetReplyId] = useState(null);
    const [selectedDisplayName, setSelectedDisplayName] = useState(null);
    const [selectedReplyDisplayName, setSelectedReplyDisplayName] = useState(null);
    const [selectedComment, setSelectedComment] = useState(null);
    const [allComments, setAllComments] = useState([])

    const handleDeleteComment = (commentId) => {

        Alert.alert(
            "Confirm",
            "Are you sure you want to delete this comment?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes", onPress: () => {
                        softDeleteComment(commentId);
                        setRepliesVisible(false)
                    }
                }
            ]
        );
    };

    const handleDeleteReply = (replyId, commentId) => {

        Alert.alert(
            "Confirm",
            "Are you sure you want to delete this comment?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes", onPress: () => {
                        softDeleteReply(replyId, commentId);
                        setRepliesVisible(false)
                    }
                }
            ]
        );
    };



    return (
        <View style={styles.portal}>
            <ScrollView>
                {comments?.map((comment, index) => (
                    <Card key={index} style={{ margin: 8 }}>
                        <Card.Content style={styles.card}>
                            <Card.Title
                                title={`${comment?.displayName ? comment.displayName : comment?.firstName} said`}
                            />
                            <Text style={{ color: "orange" }}>{formatDateAndTime(comment?.createdAt)}</Text>
                            <Text style={{ marginTop: 10 }}>{comment.deleted ? comment.content : comment.comment}</Text>
                            <Card.Actions>
                            {currentUser.uid === comment.commentedBy && !comment.deleted && (
                                <Button icon="delete" onPress={() => softDeleteComment(comment.id)}>Delete</Button>
                            )}
                            { !comment.deleted && 
                                <Button onPress={() => { setRepliesVisible(true); setSelectedCommentId(comment?.id); setSelectedEventId(eventId); setSelectedTargetReplyId(comment?.id); setSelectedDisplayName(comment?.displayName); setSelectedComment(comment?.comment) }}>
                                    <Text>Reply</Text>
                                </Button>}
                            </Card.Actions>
                        </Card.Content>
                        {comment?.replies && comment?.replies.length > 0 && comment?.replies.map((reply, replyIndex) => (
                            <Card key={`reply-${replyIndex}`} style={{ margin: 10, marginLeft: 20 }}>
                                <Card.Content style={styles.card}>
                                    {
                                        reply.targetReplyId && reply.targetReplyId !== comment.id ?
                                            <>
                                                <Card.Title
                                                    title={`${reply?.displayName ? reply.displayName : reply?.firstName} replied to ${reply?.displayName}`}
                                                />
                                                <Text style={{ marginBottom: 10, color: "orange" }}>{formatDateAndTime(reply?.createdAt)}</Text>
                                                <Text style={{ marginLeft: 20, fontStyle: 'italic', color: "gray" }}>
                                                    {reply?.displayName} said: "{reply.deleted ? reply.content : findQuoteForReply(reply.targetReplyId, comments)}"
                                                </Text>
                                            </>
                                            :
                                            <>
                                                <Card.Title
                                                    title={`${reply?.displayName ? reply.displayName : reply?.firstName} replied to ${comment?.displayName}`}
                                                />
                                                <Text style={{ marginBottom: 10, color: "orange" }}>{formatDateAndTime(reply?.createdAt)}</Text>
                                                <Text style={{ marginLeft: 20, fontStyle: 'italic', color: "gray" }}>
                                                    {comment?.displayName} said: "{comment.deleted ? comment.content : comment?.comment}"
                                                </Text>
                                            </>
                                    }
                                    <Text style={{ marginTop: 10 }}>{reply.deleted ? reply.content : reply?.reply}</Text>
                                    <Card.Actions>
                                    {reply.repliedBy === currentUser.uid && !reply.deleted &&  (<Button icon="delete" onPress={() => handleDeleteReply(reply.id, comment.id)}>Delete</Button>)}
                                    {!reply.deleted &&
                                        <Button onPress={() => { setRepliesVisible(true); setSelectedCommentId(comment?.id); setSelectedTargetReplyId(reply?.id); setSelectedEventId(eventId); setSelectedDisplayName(comment?.displayName); setSelectedReplyDisplayName(reply?.displayName); setSelectedComment(comment?.comment); setAllComments(comments) }}>
                                            <Text>Reply</Text>
                                        </Button>}
                                    </Card.Actions>
                                </Card.Content>
                            </Card>
                        ))}
                    </Card>
                ))}
            </ScrollView>

            <ReplyDialog
                selectedDisplayName={selectedDisplayName}
                selectedReplyDisplayName={selectedReplyDisplayName}
                selectedComment={selectedComment}
                setRepliesVisible={setRepliesVisible}
                visible={repliesVisible}
                commentId={selectedCommentId}
                eventId={selectedEventId}
                targetReplyId={selectedTargetReplyId}
                onDismiss={() => setRepliesVisible(false)}
                allComments={allComments}
            />
        </View >

    );
}

export const CommentsContainer = ({ comments, show, setShow, currentUser}) => {
    const noComments = comments?.length === 0;

    return (
        <View style={{ marginTop: 20 }}>
            {noComments ? (
                <Text style={{ color: "black", textAlign: "center" }}>No comments</Text>
            ) : (
                <>
                    <Button title="Toggle Comments" mode="elevated" onPress={() => setShow(!show)}>Toggle Comments</Button>
                    {show && <CommentsView comments={comments} currentUser={currentUser}
                        onDismiss={() => setRepliesVisible(false)} />}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 10,
    },
    backgroundImage: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    flex: {
        flex: 1,
    },
    flexGrow: {
        flexGrow: 1,
        justifyContent: "center",
    },
    overlay: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.3)",
    },

    registerContainer: {
        backgroundColor: "white",
        borderRadius: 25,
        padding: 20,
    },



});
