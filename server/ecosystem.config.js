module.exports = {
    apps: [{
      name: "audio-app",
      watch: true,  
      script: "./server.js",
      // Delay between restart
      watch_delay: 5000,
      ignore_watch : ["node_modules", ".git"],
      watch_options: {
        "followSymlinks": false
      }
    }]
}