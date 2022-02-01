module.exports = {
    afterCommentSave:async (request)=>{
        let post = await new Parse.Query('Post').get(request.object.get('post').id, { useMasterKey: true });
        post.increment('replies');
        post.save(null, { useMasterKey: true });
    }
}