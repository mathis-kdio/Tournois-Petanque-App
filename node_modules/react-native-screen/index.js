import { Dimensions } from 'react-native'

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width


function sh(value) {
    return(screenHeight*(value/120))
}

function sw(value) {
    return(screenWidth*(value/120))
}

export {
    sh,
    sw
};
