module.exports = {
  getUserChats:async (request,response)=>{
    let counts = {};
    let user = request.user;
    let chats = await new Parse.Query('Chat').containedIn('users',[user]).find({useMasterKey:true});
    let messages = await new Parse.Query('Message').containedIn('chat',chats).notContainedIn('seenBy',[user]).notEqualTo('from',user).find({useMasterKey:true});
    messages.forEach((message)=>{
      if(!counts[message.get('chat').id]){
        counts[message.get('chat').id] = 0;
      }
      counts[message.get('chat').id]++;
    });
    response.success(counts);
  }

}