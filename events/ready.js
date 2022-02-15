module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Lancé sous le bot ${client.user.tag}`);
        client.user.setActivity(`ping: ${client.ws.ping}ms.`);
    },
};