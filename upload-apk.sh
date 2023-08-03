echo "Subiendo APK ..."
scp ./android/app/build/outputs/apk/debug/app-debug.apk adricq@vps1.servimav.com:~

sshCommands="$(cat <<END_HEREDOC
# Go To dir
echo "Cambiando directorio a /var/www/servimav.com/wings/api/public/storage/apps/"

cd /var/www/servimav.com/wings/api/public/storage/apps/

# Copy file

echo "Copiando archivo 2_v0.3.0.apk y 3_v0.3.0.apk ... "

mv ~/app-debug.apk ./
cp ./app-debug.apk ./2_v0.3.0.apk
cp ./app-debug.apk ./3_v0.3.0.apk

echo "Copia completada!!!"

END_HEREDOC
)"

ssh adricq@vps1.servimav.com -t "$sshCommands"