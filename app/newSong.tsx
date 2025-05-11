import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

const NewSong = () => {
    return (
        <View>
            <TextInput placeholder="Song Name" />
            <TextInput placeholder="I heard there was a secret chord" />
        </View>
    )
}
export default NewSong
const styles = StyleSheet.create({})