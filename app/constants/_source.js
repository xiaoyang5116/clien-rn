// ===============================
// 获得头像
// ===============================
export const changeAvatar = (avatar) => {
    const avatarList = [
        { id: "1", img: require('../../assets/avatar/1.jpg'), },
        { id: "2", img: require('../../assets/avatar/2.jpg'), },
    ]
    return avatarList.find(a => a.id === avatar).img
}