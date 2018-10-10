const steamUser = require('steam-user');
const steamTotp = require('steam-totp');

const client = new steamUser();

const logOnOptions = {
    accountName: process.env.USERNAME,
    password: process.env.PASSWORD,

    //twoFactor: steamTotp.generateAuthCode('https://www.reddit.com/r/SteamBot/comments/3w5zwb/info_get_your_2fa_codes_from_android_no_root/')
};

client.logOn(logOnOptions);

client.on('loggedOn', () => {
    console.log('success');

    client.setPersona(steamUser.Steam.EPersonaState.Online, 'big men');
});