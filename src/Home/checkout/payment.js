import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, StyleSheet, Alert, Image } from "react-native";
import {
  Text,
  FAB,
  Card,
  Divider,
  TouchableRipple,
  ActivityIndicator,
  Button,
  Modal,
  Portal,
  Icon
} from "react-native-paper";
import { Asset } from "expo-asset";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "@react-navigation/native";

const Payment = ({ route }) => {
  const { updatedTransaction } = route.params;
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
    const navigation = useNavigation();

  const showModal = () => {
    setVisible(true);

    setTimeout(() => {
        setVisible(false);
        handleSuccess();
        }, 2000);
  }
  const hideModal = () => setVisible(false);

  const handleSuccess = () => {
    updatedTransaction.status.paid = true;

    
    // update database with paid transaction.
    navigation.navigate("Content", {
        screen: "Transactions"
    });
    };

  useEffect(() => {
    const reference = updatedTransaction.transaction_id;
    const mobile = updatedTransaction.queuer_mobile;
    const amount = updatedTransaction.total_cost;
    let currentHour = String(new Date().getHours()).padStart(2, "0");
    console.log("currentHour", currentHour);
    // expiry date should be 30 minutes from current time in current device timezone
    let expiryDate = new Date(new Date().getTime() + 5 * 60000);
    let year = expiryDate.getFullYear();
    let month = String(expiryDate.getMonth() + 1).padStart(2, "0");
    let day = String(expiryDate.getDate()).padStart(2, "0");
    let hour = String(expiryDate.getHours()).padStart(2, "0");
    let minute = String(expiryDate.getMinutes()).padStart(2, "0");

    let expiryDateFormatted = `${year}-${month}-${day} ${hour}:${minute}`;
    console.log("expiryDate", expiryDateFormatted);

    setQrCodeUrl(
      `https://www.sgqrcode.com/paynow?mobile=${mobile}&uen=&editable=0&amount=${amount}&expiry=${year}%2F${month}%2F${day}%20${hour}%3A${minute}&ref_id=${reference}&company=`
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    if (qrCodeUrl) {
      Asset.fromURI(qrCodeUrl).downloadAsync();
    }
  }, [qrCodeUrl]);

  const downloadQrCode = async () => {
    try {
      // Request permissions for accessing media library
      const permissionResult = await MediaLibrary.requestPermissionsAsync();
      if (permissionResult.granted === false) {
        alert("Permission to access media library is required!");
        return;
      }
  
      const fileUri = FileSystem.documentDirectory + "qrCode.png";
      const response = await FileSystem.downloadAsync(qrCodeUrl, fileUri);
  
      // Create an asset from the downloaded file
      const asset = await MediaLibrary.createAssetAsync(response.uri);
  
      // Check if the 'Downloads' album exists
      const existingAlbum = await MediaLibrary.getAlbumAsync('Downloads');
      if (existingAlbum) {
        // If it exists, add the asset to it
        await MediaLibrary.addAssetsToAlbumAsync([asset], existingAlbum, false);
      } else {
        // If it doesn't exist, create it and add the asset
        await MediaLibrary.createAlbumAsync('Downloads', asset, false);
      }
  
      // Optionally, you might want to delete the original file to avoid duplication
      await FileSystem.deleteAsync(fileUri);
  
      console.log("QR Code downloaded successfully!");

      showModal();
    } catch (error) {
      console.log(error);
    }
  };
  
  

  const cacheImages = async (imageUris) => {
    const cacheImages = imageUris.map((uri) => {
      if (!uri) return null; // Skip if no URI
      return Asset.fromURI(uri).downloadAsync();
    });
    await Promise.all(cacheImages);
  };

  return (
    <View style={styles.container}>
      <View style={styles.subtitle}>
        <Text style={styles.title}>Payment</Text>
        <Text>
          Scan or upload this QR code to your banking app to complete your
          transaction.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : error ? (
        <Text style={styles.errorText}>Failed to load QR Code.</Text>
      ) : qrCodeUrl ? (
        <View>
          <Card style={styles.card}>
            <Image
              source={{ uri: qrCodeUrl }}
              style={styles.image}
              onError={() => setError(true)}
            />
          </Card>
          <Button
            mode="contained"
            onPress={downloadQrCode}
            style={styles.button}
          >
            Save to Photos
          </Button>
        </View>
      ) : (
        <Text>No QR Code Available</Text>
      )}
      <Portal>
        <Modal contentContainerStyle={styles.modal} visible={visible} onDismiss={hideModal}>
        <Icon source="check-circle" size={50} />

            <View style={styles.successMessage}>

            <Text variant="titleMedium">QR Code Saved</Text>
            <Text>Launch your banking app and upload the QR code to complete your transaction. Your QR code will expire in 5 minutes</Text>

            </View>

        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    marginBottom: 20,
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  card: {
    marginBottom: 10,
    padding: 10,
    alignItems: "center",
  },
  button: {
    marginTop: 10,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    flexDirection: "row",
  },
    successMessage: {
        marginLeft: 20,
        flex: 1,
    },
});

export default Payment;
