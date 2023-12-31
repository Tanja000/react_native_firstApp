import { colors } from './Colors'; 

export const textStyle = {
    flagImage: {
      width: 40,
      height: 30,
    },
    label: {
        fontWeight: 'bold',
        marginRight: 8,
        color: colors.primaryText, 
      },
    textMain: {
        fontSize: 20, 
        color: colors.primaryText, 
    },
    textSmall: {
        fontSize: 14, 
        color: colors.primaryText, 
    },
    textButton: {
        fontSize: 14, 
        color: colors.secondaryText, 
    },
    flatListContainer: {
        justifyContent: 'center',
        alignItems: 'center',
      },
     dateInput: {
        height: 40,
        width: 200,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        marginBottom: 10,
      },
      errorText: {
        color: 'red',
        marginBottom: 10,
      },
  };