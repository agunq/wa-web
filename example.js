const { Client, MessageMedia, LocalAuth, LegacySessionAuth, List, Buttons} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require("fs");
const axios = require('axios');
const Scraper = require('@yimura/scraper').default;
const youtube = new Scraper();

function downloadGambar(url){
	return axios.get(url, {responseType: 'arraybuffer'})
		.then(response => Buffer.from(response.data, "binary").toString("base64"))
}


const SESSION_FILE_PATH = './session.json';
let sessionCfg;
var client;


client = new Client({
    	authStrategy: new LocalAuth(),
	//authStrategy: new LegacySessionAuth(),
	//puppeteer: 	{ headless: false }
	//puppeteer:	{
       	//executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    	//		}
});


client.on('qr', (qr) => {
    	// Generate and scan this code with your phone
    	console.log('QR RECEIVED', qr);
	qrcode.generate(qr, {small: true}, function (qrcode) {
    		console.log(qrcode)
	});

});

client.on('ready', () => {
    console.log('Client is ready!');
});

const prefix = "!";

client.on('message', async msg => {
	console.log(msg.body);
    	if (msg.body == '!ping') {
        	msg.reply('pong');
    	}

	if (msg.body == "selamat pagi") {
		client.sendMessage(msg.from, 'selamat pagi juga');
	}

	if (msg.body[0] == prefix){
		var [cmd, ...args] = msg.body.slice(1).split(" ");
		args = args.join(" ");

		if (cmd == "say"){
			client.sendMessage(msg.from, args);
		}

		if (cmd == "gambar"){
			const media = await MessageMedia.fromUrl('https://storage.googleapis.com/sizigi-public-bucket/website/tween1.mp4');
			client.sendMessage(msg.from, media);
		}

		if (cmd == "g2"){
			const media = await MessageMedia.fromUrl(args);
			client.sendMessage(msg.from, media);
		}
		
		if (cmd == "g3"){
			const media = await MessageMedia.fromUrl(args);
			client.sendMessage(msg.from, media, { sendMediaAsSticker: true });
		}
	
		if (cmd == "yt" || cmd == "youtube"){
			youtube.search(args).then(results => {
    				//console.log(results.videos[0]);
				client.sendMessage(msg.from,  results.videos[0].description + " " + results.videos[0].link );
			});	
		}

	
		if (cmd == 'list') {
        		let sections = 	[{	
						title:'sectionTitle',
						rows:[{title:'ListItem1', description: 'desc'}, {title:'ListItem2'}]
					}];

        		let list = new List('List body','btnText',sections,'Title','footer');
        		client.sendMessage(msg.from, list);
		}

		if (cmd == 'list2') {
        		let sections = 	[{	
						title:'sectionTitle',
						rows:[{title:'ListItem1', description: 'desc'}, {title:'ListItem2'}]
					}];

        		let list = new List('List body',['btnText', "btefww"],sections,'Title','footer');
        		client.sendMessage(msg.from, list);
		}

	}

});

client.initialize();
