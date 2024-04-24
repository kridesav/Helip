import React, { useState, useEffect } from 'react';
import { Button, Surface, Text, Switch, Portal, Dialog, Icon, TextInput } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { CommentsContainer, CommentsView } from '../../components/Comments';
import { useRealTimeUserComments } from '../../hooks/comments/useFetchCommentsbyUser';

const MessageScreen = ({ route }) => {
    const { uid } = route.params;
    const { comments } = useRealTimeUserComments(uid);
    const [sortOrder, setSortOrder] = useState('time');

    if (comments.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 20 }}>No comments yet</Text>
            </View>
        );
    }
    
    const filteredComments = comments.filter(comment => comment.content !== "This comment was deleted.");

    const sortedComments = [...filteredComments].sort((a, b) => {
        switch (sortOrder) {
            case 'newest':
                return b.createdAt.toDate() - a.createdAt.toDate(); // newest first
            case 'oldest':
                return a.createdAt.toDate() - b.createdAt.toDate(); // oldest first
            case 'mostReplies':
                return b.replies.length - a.replies.length; // most replies first
            default:
                return 0;
        }
    });

    return (
        <View>
            <Surface style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between', borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }}>
                <Button style={{marginLeft: 15}} compact icon='new-box' mode="outlined" onPress={() => setSortOrder('newest')}>Newest</Button>
                <Button compact icon='history' mode="outlined" onPress={() => setSortOrder('oldest')}>Oldest</Button>
                <Button style={{marginRight: 15}} compact icon='comment-plus' mode="outlined" onPress={() => setSortOrder('mostReplies')}>Most Replies</Button>
            </Surface>
            <CommentsView comments={sortedComments} currentUser={uid} />
        </View>
    );
}

export default MessageScreen;

