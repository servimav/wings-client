yarn build
rm client-zip
zip client.zip -r dist
scp client.zip adricq@vps1.servimav.com:/var/www/servimav.com/wings/client/