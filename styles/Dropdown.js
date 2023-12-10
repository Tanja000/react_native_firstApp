import { colors } from './Colors'; 

export const dropDownstyle = {
    container: {
        backgroundColor: colors.backgroundSecondary,
        borderColor: colors.colorDelete,
        borderWidth: 1, 
        borderRadius: 20, 
        padding: 10,
      },
      dropdown: {
        height: 50,
        borderColor: colors.colorDelete,
        borderWidth: 0.5,
        borderRadius: 20,
        paddingHorizontal: 8,
      },
      icon: {
        marginRight: 5,
      },
      label: {
        position: 'absolute',
        backgroundColor: 'white',
        color: colors.colorDelete,
        left: 22,
        top: -22,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
        borderColor: colors.colorDelete,
        borderWidth: 0.5,
        borderRadius: 20,
      },
      placeholderStyle: {
        fontSize: 16,
      },
      selectedTextStyle: {
        fontSize: 16,
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      }
}