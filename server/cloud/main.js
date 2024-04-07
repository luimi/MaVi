const wall = require('./wall');
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

Parse.Cloud.onLiveQueryEvent(async (ws) => {
  if (ws.event === 'ws_disconnect') {
    let users = await new Parse.Query('_User').equalTo('isOnline', true).find({ useMasterKey: true });
    users.forEach((user) => {
      user.set('isOnline', false);
    });
    Parse.Object.saveAll(users, { useMasterKey: true });
  }
});

Parse.Cloud.afterSave('Comment', wall.afterCommentSave);

Parse.Cloud.job("initialize", async (request) => {
  if (await new Parse.Query("_Role").equalTo("name", "Admin").first()) return 'App already initialized'
  // Create Admin User
  const user = new Parse.User();
  user.set("username", "admin");
  user.set("password", "admin");
  user.set("name", "Administrador");
  const userAdmin = await user.signUp();

  // Create Admin Role
  var roleACL = new Parse.ACL();
  roleACL.setPublicReadAccess(true);
  roleACL.setWriteAccess(userAdmin.id, true);
  var admin = new Parse.Role("Admin", roleACL);
  const roleAdmin = await admin.save();
  roleAdmin.getUsers().add(userAdmin);
  await roleAdmin.save(null, { useMasterKey: true });
  // End Initialization
  await Parse.Config.save({
    userExtraParams: [],
    modules: [{ "tab": "news", "icon": "paper", "title": "Noticias", "status": true }, { "tab": "wall", "icon": "apps", "title": "Muro", "status": true }, { "tab": "chat", "icon": "chatboxes", "title": "Chat", "status": true }, { "tab": "areas", "icon": "calendar", "title": "Areas sociales", "status": true }]
  });
  return 'App initialized';

});
Parse.Cloud.define("updateParam", async (request) => {
  if (request.user && await new Parse.Query(Parse.Role).equalTo('name', 'Admin').equalTo('users', request.user).first()) {
    const params = request.params;
    let data = {};
    data[params.param] = params.data;
    await Parse.Config.save(data);
    return true;
  } else {
    return false;
  }
});

Parse.Cloud.define("uploadImage", async (request) => {
  return new Promise((res, rej) => {
    cloudinary.v2.uploader.upload(
      request.params.image, {}, async (error, result) => {
        if (result) {
          res({ success: true, url: result.url });
        } else {
          res({ success: false, message: "Error al intentar guardar la imagen", error: error });
        }
      }
    );
  });
});