import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Image } from "react-native";
import {
  ActivityIndicator,
  Text,
  Card,
  Paragraph,
  Button,
} from "react-native-paper";
import { Asset } from "expo-asset";
import { getMarkers } from "../../services/markers";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";

const Information = () => {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(""); // Declare qrCodeUrl as a state variable

  useEffect(() => {
    fetchMarkers();
    let amount = 10;
    let mobilenumber = "87807710";
    let reference = "thisisatestreference";
    let currentHour = String(new Date().getHours()).padStart(2, "0");
    console.log("currentHour", currentHour);
    // expiry date should be 30 minutes from current time in current device timezone
    let expiryDate = new Date(new Date().getTime() + 30 * 60000);
    let year = expiryDate.getFullYear();
    let month = String(expiryDate.getMonth() + 1).padStart(2, "0");
    let day = String(expiryDate.getDate()).padStart(2, "0");
    let hour = String(expiryDate.getHours()).padStart(2, "0");
    let minute = String(expiryDate.getMinutes()).padStart(2, "0");

    let expiryDateFormatted = `${year}-${month}-${day} ${hour}:${minute}`;
    console.log("expiryDate", expiryDateFormatted);

    setQrCodeUrl(
      `https://www.sgqrcode.com/paynow?mobile=${mobilenumber}&uen=&editable=0&amount=${amount}&expiry=${year}%2F${month}%2F${day}%20${hour}%3A${minute}&ref_id=${reference}&company=`
    );
  }, []);

  useEffect(() => {
    if (qrCodeUrl) {
      Asset.fromURI(qrCodeUrl).downloadAsync();
    }
  }, [qrCodeUrl]);

  const fetchMarkers = async () => {
    setLoading(true);
    try {
      const data = await getMarkers();
      await cacheImages(data.map((marker) => marker.image));
      setMarkers(data);
    } catch (err) {
      console.error(err);
      setError("Error fetching data: " + err.message);
    }
    setLoading(false);
  };

  const downloadQrCode = async () => {
    try {
      // Request permissions for accessing photos and videos
      const permissionResult = await MediaLibrary.requestPermissionsAsync();
      if (permissionResult.granted === false) {
        alert("Permission to access media library is required!");
        return;
      }

      const fileUri = FileSystem.documentDirectory + "qrCode.png";
      const response = await FileSystem.downloadAsync(qrCodeUrl, fileUri);

      const asset = await MediaLibrary.createAssetAsync(response.uri);

      const existingFolder = await MediaLibrary.getAlbumAsync("Download");
      if (!existingFolder) {
        await MediaLibrary.createAlbumAsync("Download", asset, true);
        await FileSystem.deleteAsync(response.uri);
      } else {
        MediaLibrary.addAssetsToAlbumAsync(asset, existingFolder.id, true);
        await FileSystem.deleteAsync(response.uri);
      }
      console.log("QR Code downloaded successfully!");
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

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Information</Text>

      {qrCodeUrl ? (
        <Card style={styles.card}>
          <Image
            source={{ uri: qrCodeUrl }}
            style={styles.image}
            onLoad={() => console.log("QR Code Image loaded")}
            onError={(e) =>
              console.log("Failed to load image:", e.nativeEvent.error)
            } // Log any errors
          />
          <Button onPress={downloadQrCode}>Download QR Code</Button>
        </Card>
      ) : (
        <Text>Loading QR Code...</Text>
      )}

      <FlatList
        data={markers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.title} />
            <Card.Content>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.image} />
              ) : (
                <Text>Loading image...</Text>
              )}
              <Paragraph>{item.description}</Paragraph>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    paddingTop: 40,
    paddingBottom: 20,
  },
  card: {
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollView: {
    width: "100%",
  },
});

export default Information;
