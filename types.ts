import { Href } from "expo-router"
import { Firestore, Timestamp } from "firebase/firestore"
import { Icon } from "phosphor-react-native";
import React, { ReactNode } from "react";
//Promise<>
// This indicates that the function is asynchronous and returns a Promise.
// A Promise is used for handling asynchronous operations in JavaScript (e.g., API calls, database interactions).
//it is ;like waiting for an answer from the server
//When we use a Promise in JavaScript, it guarantees that the computer will give us a result—but we have to wait.
import {
    ActivityIndicator,
    ActivityIndicatorProps,
    ImageStyle,
    PressableProps,
    TextInput,
    TextInputProps,
    TextProps,
    View,
    ViewStyle,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,

} from "react-native";

export type ScreenWrapperProps = {
    style?: ViewStyle;
    children: React.ReactNode;
}

export type TypoProps = {
    size?: number;
    color?: string;
    fontWeight?: TextStyle["fontWeight"];
    children: any | null;
    style?: TextStyle;
    textProps?: TextProps;

};

export interface CustomButtonProps extends TouchableOpacityProps {
    style?: ViewStyle;
    onPress?: () => void;
    loading?: boolean;
    children : React.ReactNode;
};

export type BackButtonProps = {
    style?: ViewStyle;
    iconSize?: number;
};
export type InputProps = {
    icon?: React.ReactNode;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    inputRef?: React.RefObject<TextInput>;
    placeholder?: string;
    onChangeText?: (value: string) => void;
    secureTextEntry?: boolean;
    //label?: string;
    //error?:string;
};
export type AuthContextType = {
    user: UserType;
    setUser: Function;
    login: (
        email: string,
        password: string
    ) => Promise<{ success: boolean; msg?: string }>;
    register: (
        email: string,
        password: string,
        name: string

        
    ) => Promise<{ success: boolean; msg?: string }>;
    
    updateUserData: (userId: string) => Promise<void>;
};
export type UserType = {
    uid?: string;
    email?: string | null;
    name: string | null;
    image?: any;
} | null;
export type HeaderProps = {
    title?: string,
    style?: ViewStyle,
    leftIcon?: ReactNode
    rightIcon?: ReactNode,
//     onLeftIconPress?: () => void,
//     onRightIconPress?: () => void 
}
export type accountOptionType = {
    title: string,
    icon: React.ReactNode;
    bgColor: string;
    routeName?: any;
}