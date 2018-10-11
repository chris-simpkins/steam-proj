require('dotenv').config();
const steamUser = require('steam-user');
const steamTotp = require('steam-totp');
const steamCommunity = require('steamcommunity');
const tradeOfferManager = require('steam-tradeoffer-manager');

const client = new steamUser();
const community = new steamCommunity();
const manager = new tradeOfferManager({
    steam: client,
    community: community,
    language: 'en'
});

const logOnOptions = {
    accountName: process.env.PRIMARY_USER,
    password: process.env.PRIMARY_PASSWORD,

    twoFactorCode: steamTotp.generateAuthCode(process.env.PRIMARY_SECRET)
};

console.log(process.env.PRIMARY_USER);

function sendRandomItem() {
    manager.loadInventory(440, 2, true, (err, inventory) => {
        if (err) {
            console.log(err);
        } else {
            const offer = manager.createOffer('trustedfriendid');
            const item = inventory[Math.floor(Math.random() * inventory.length - 1)];

            offer.addMyItem(item);
            offer.setMessage(`item: ${item.name}`);
            offer.send((err, status) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Sent offer. status ${status}`);
                }
            });
        }
    });
}

client.logOn(logOnOptions);

client.on('loggedOn', () => {
    console.log('success');

    client.setPersona(steamUser.Steam.EPersonaState.Online);
});

client.on('webSession', (sessionid, cookies) => {
    manager.setCookies(cookies);

    community.setCookies(cookies);
    community.startConfirmationChecker(10000, 'identity_secret');
    //sendRandomItem();
});

manager.on('newOffer', offer => {
    if (offer.partner.getSteamID64() === 'trustedfriendid') {
        offer.accept((err, status) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`Accepted offer, status: ${status}`);
            }
        });
    } else {
        offer.decline(err => {
            if(err) {
                console.log(err);
            } else {
                console.log('Canceled offer');
            }
        });
    }
});