import { colors } from './Colors'; 

export const inputStyle = {
    primary: {
        backgroundColor: colors.backgroundSecondary, 
        borderColor: colors.colorDelete,
        borderWidth: 1, 
        borderRadius: 20, 
        padding: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
      },
    invalidInput: {
        borderColor: 'red',
      },
  };