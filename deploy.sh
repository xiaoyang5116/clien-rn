#/bin/bash

# 资源路径
ASSETS_PATH=./android/app/src/main/assets/
CONFIG_FILE=./app/constants/_others.js

# 复制资源到Assets目录
rm -rf $ASSETS_PATH/config
cp -R config $ASSETS_PATH
echo "资源复制[Done]"

# 修改编译相关变量
mv $CONFIG_FILE $CONFIG_FILE.bak
sed 's/DEBUG_MODE = true/DEBUG_MODE = false/g' $CONFIG_FILE.bak > $CONFIG_FILE
echo "初始化编译变量[Done]"

# 生成APK
echo "开始编译"
cd android && ./gradlew clean && ./gradlew assembleRelease && cd ..
echo "编译完成"

# 复制APK到根目录
cp ./android/app/build/outputs/apk/release/*.apk ./

# 清理打包资源
rm -rf $ASSETS_PATH/config
rm -rf $CONFIG_FILE
mv $CONFIG_FILE.bak $CONFIG_FILE
echo "清理完毕！"
echo "安卓Apk生成完毕!"

# 自动安装到设备
# adb install *.apk
# echo "APK 已安装"