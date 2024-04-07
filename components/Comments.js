import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Button, Dialog, Portal, TextInput, Text, Card } from 'react-native-paper';
import { useFetchCurrentUserProfile } from "../hooks/useFetchCurrentUserProfile";
import { addComment } from '../hooks/comments/utils/addComment'
import { addReplyToComment } from '../hooks/comments/utils/addReplyToComment';
import formatDateAndTime from '../../Helip/utils/formatDateAndTime';
import useAuth from '../hooks/useAuth';

export const CommentsDialog = ({ visible, onDismiss, eventId }) => {
    const [value, setValue] = React.useState({
        comment: "",
        eventId: eventId,
    });
    const [errors, setErrors] = useState({});
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
                        setErrors({});
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
            <Dialog visible={visible} onDismiss={onDismiss}>
                <Dialog.Title>Add a Comment</Dialog.Title>
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
                <Dialog.Actions>
                    <Button onPress={onDismiss}>Cancel</Button>
                    <Button onPress={handleAddComment}>Post</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export const ReplyDialog = ({ visible, onDismiss, commentId }) => {
    console.log("ReplyDialog commentId:", commentId);

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

                    }
                }
            ]
        );
    };


    const addReplyToFirestore = async () => {
        console.log("Adding reply, commentId:", commentId);
        const replyData = {
            reply: value.reply,
        };

        try {
            const success = await addReplyToComment(replyData, userId, profile.displayName, profile.firstName, commentId);
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
            <Dialog visible={visible} onDismiss={onDismiss}>
                <Dialog.Title>Add a reply</Dialog.Title>
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


export const CommentsView = ({ comments, eventId }) => {
    const [repliesVisible, setRepliesVisible] = useState(false);
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [selectedEventId, setSelectedEventId] = useState(null);

    return (
        <View style={styles.portal}>
            <ScrollView>
                {comments?.map((comment, index) => (
                    <Card key={index} style={{ margin: 8 }}>

                        <View key={comment.id}>
                            <Card.Content style={styles.card}>
                                <Card.Title
                                    title={` ${comment?.displayName ? comment.displayName : comment?.firstName} said`}
                                />
                                <Text>{`${formatDateAndTime(comment?.createdAt)}:`}</Text>
                                <Text style={{marginTop:10}}>{comment.comment}</Text>
                            </Card.Content>
                            <Card.Actions>
                                <Button onPress={() => { setRepliesVisible(true); setSelectedCommentId(comment.id); setSelectedEventId(eventId) }}>
                                    <Text>Reply</Text>
                                </Button>
                            </Card.Actions>

                            {comment.replies && comment.replies.map((reply) => (
                                <View key={reply.id} style={{ marginLeft: 20 }}>
                                    <Text>{reply.text}</Text>
                                </View>
                            ))}
                        </View>
                    </Card>
                ))}


            </ScrollView>
            <ReplyDialog
                visible={repliesVisible}
                commentId={selectedCommentId}
                eventId={selectedEventId}
                onDismiss={() => setRepliesVisible(false)}
            />
        </View>

    );
}

export const CommentsContainer = ({ comments }) => {
    const [show, setShow] = useState(false);
    const noComments = comments?.length === 0;

    return (
        <View style={{ marginTop: 20 }}>
            {noComments ? (
                <Text style={{ color: "black", textAlign: "center" }}>No comments</Text>
            ) : (
                <>
                    <Button title="Toggle Comments" mode="elevated" onPress={() => setShow(!show)}>Toggle Comments</Button>
                    {show && <CommentsView comments={comments}
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

});
