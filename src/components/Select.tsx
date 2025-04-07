import React, { ReactNode, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Dimensions,
  Keyboard,
  Platform,
} from "react-native";
import Modal from "react-native-modal";
import { COLOR } from "../constants/color";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  icon?: ReactNode;
  error?: string;
  disabled?: boolean;
}

const Select = ({
  value,
  onChange,
  options,
  label,
  placeholder = "Chọn",
  icon,
  error,
  disabled = false,
}: SelectProps) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [modalHeight, setModalHeight] = useState(SCREEN_HEIGHT * 0.8);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setModalHeight(
          SCREEN_HEIGHT -
            e.endCoordinates.height -
            (Platform.OS === "ios" ? 40 : 20)
        );
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
        setModalHeight(SCREEN_HEIGHT * 0.8);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const iconColor = value ? "#333" : "#999";
  const styledIcon =
    icon &&
    React.cloneElement(icon as React.ReactElement, {
      color: iconColor,
    });

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setModalVisible(false);
    setSearchText("");
  };

  const closeModal = () => {
    setModalVisible(false);
    setSearchText("");
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.selectContainer, error && styles.selectContainerError]}
        onPress={() => !disabled && setModalVisible(true)}
      >
        {icon && <View style={styles.icon}>{styledIcon}</View>}
        <Text
          style={[
            styles.selectText,
            !value && styles.placeholder,
            icon ? styles.selectTextWithIcon : null,
          ]}
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
        </Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeModal}
        style={styles.modal}
        avoidKeyboard={false}
        backdropTransitionOutTiming={0}
        statusBarTranslucent
        useNativeDriverForBackdrop
      >
        <View style={[styles.modalContent, { maxHeight: modalHeight }]}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{placeholder}</Text>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm..."
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="done"
            />
          </View>

          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.value.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleSelect(item.value.toString())}
              >
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  selectContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLOR.BACKGROUND,
    backgroundColor: COLOR.BACKGROUND,
    borderRadius: 8,
    minHeight: 48,
    position: "relative",
    paddingHorizontal: 14,
  },
  selectContainerError: {
    borderColor: "#ff3333",
  },
  selectText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  selectTextWithIcon: {
    marginLeft: 8,
  },
  placeholder: {
    color: "#999",
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
  },
  disabled: {
    backgroundColor: "#f0f0f0",
    borderColor: "#d0d0d0",
  },
  errorText: {
    color: "#ff3333",
    fontSize: 12,
    marginTop: 4,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    fontSize: 20,
    color: "#666",
    padding: 4,
  },
  searchContainer: {
    padding: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionText: {
    color: "#333",
    fontSize: 15,
  },
});

export default Select;
