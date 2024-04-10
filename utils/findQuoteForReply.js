export const findQuoteForReply = (targetReplyId, comments) => {
    let quotedText = '';
    comments.forEach(comment => {
        if (comment.replies) {
            const targetReply = comment.replies.find(reply => reply.id === targetReplyId);
            if (targetReply) {
                quotedText = targetReply.reply;
            }
        }
    });

    return quotedText;
};