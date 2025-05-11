import React from 'react'
import { TextInput, View } from 'react-native'

const NewSong = () => {
    return (
        <View className="flex-1 items-left justify-left p-6 bg-light-bg">
            <TextInput className="placeholder:text-light-text-placeholder text-2xl font-semibold" placeholder="Song Name" />
            <TextInput className="placeholder:text-light-text-placeholder text-xl font-large" placeholder="I heard there was a secret chord" />
        </View>
    )
}
export default NewSong