import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { Save, Clock, FileText, Trash2, Shield } from "lucide-react-native";
import { useDocumentStorage, SavedDocument } from "../hooks/useDocumentStorage";
import API from "../api/api";
import { PSBColors } from "../utils/PSBColors";
import { colors } from "../utils/colors";
import TranslatedText from "./TranslatedText";

interface FileInfo {
  uri: string;
  name: string;
  size: number;
  type: string;
}

interface DocumentVaultProps {
  file: FileInfo | null;
  hash: string;
}

async function saveDocumentToBackend(document: any) {
  console.log("Sending to backend:", document);
  try {
    const res = await API.post("/documents", document);
    const data = res.data;
    console.log("Backend response:", data);
    return data;
  } catch (error) {
    console.log("Backend error:", error);
    throw error;
  }
}

export const DocumentVault = ({ file, hash }: DocumentVaultProps) => {
  const { saveDocument, getDocumentsByWallet, deleteDocument } =
    useDocumentStorage();
  const [isSaving, setIsSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<SavedDocument | null>(null);

  const userDocuments = getDocumentsByWallet();

  const handleSaveDocument = async () => {
    if (!file || !hash) return;

    setIsSaving(true);
    try {
      saveDocument(
        file.name,
        hash,
        "local-user", // Since we don't have wallet connection in mobile
        file.size,
        file.type
      );

      // Save to backend as well
      await saveDocumentToBackend({
        filename: file.name,
        hash: hash,
        walletAddress: "local-user",
        timestamp: Date.now(),
        size: file.size,
        type: file.type,
      });

      Alert.alert(
        "Document Saved",
        `Name: ${file.name}\nHash: ${hash}\nSize: ${file.size} bytes\nType: ${
          file.type
        }\nWallet: local-user\nTimestamp: ${new Date().toLocaleString()}`
      );
    } catch (error) {
      Alert.alert("Error", "Failed to save document");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDocument = (id: string) => {
    Alert.alert(
      "Delete Document",
      "Are you sure you want to remove this document from your vault?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteDocument(id);
            Alert.alert("Success", "Document removed from your vault");
          },
        },
      ]
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (timestamp: number): string => {
    return (
      new Date(timestamp).toLocaleDateString() +
      " " +
      new Date(timestamp).toLocaleTimeString()
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Shield size={20} color={PSBColors.primary.green} />
          </View>
          <View>
            <TranslatedText style={styles.title}>Document Vault</TranslatedText>
            <TranslatedText style={styles.subtitle}>
              Securely store document hashes locally
            </TranslatedText>
          </View>
        </View>
        <View style={styles.saveButtonContainer}>
          {file && hash && (
            <TouchableOpacity
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSaveDocument}
              disabled={isSaving}
            >
              <Save size={16} color="white" />
              <TranslatedText style={styles.saveButtonText}>
                {isSaving ? "Saving..." : "Save"}
              </TranslatedText>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Modal for full document info */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TranslatedText style={styles.modalTitle}>
              Document Details
            </TranslatedText>
            {selectedDoc && (
              <>
                <TranslatedText style={styles.modalLabel}>
                  Name:{" "}
                  <TranslatedText style={styles.modalValue}>
                    {selectedDoc.filename}
                  </TranslatedText>
                </TranslatedText>
                <TranslatedText style={styles.modalLabel}>
                  Hash:{" "}
                  <TranslatedText style={styles.modalValue}>
                    {selectedDoc.hash}
                  </TranslatedText>
                </TranslatedText>
                <TranslatedText style={styles.modalLabel}>
                  Size:{" "}
                  <TranslatedText style={styles.modalValue}>
                    {formatFileSize(selectedDoc.size)}
                  </TranslatedText>
                </TranslatedText>
                <TranslatedText style={styles.modalLabel}>
                  Type:{" "}
                  <TranslatedText style={styles.modalValue}>
                    {selectedDoc.type}
                  </TranslatedText>
                </TranslatedText>
                <TranslatedText style={styles.modalLabel}>
                  Wallet:{" "}
                  <TranslatedText style={styles.modalValue}>
                    {selectedDoc.walletAddress}
                  </TranslatedText>
                </TranslatedText>
                <TranslatedText style={styles.modalLabel}>
                  Timestamp:{" "}
                  <TranslatedText style={styles.modalValue}>
                    {formatDate(selectedDoc.timestamp)}
                  </TranslatedText>
                </TranslatedText>
              </>
            )}
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <TranslatedText style={styles.closeButtonText}>
                Close
              </TranslatedText>
            </Pressable>
          </View>
        </View>
      </Modal>

      {userDocuments.length > 0 && (
        <View style={styles.documentsSection}>
          <TranslatedText style={styles.documentsTitle}>
            Your Saved Documents
          </TranslatedText>
          <View style={styles.documentsListContainer}>
            <ScrollView
              style={styles.documentsList}
              showsVerticalScrollIndicator={true}
            >
              {userDocuments.map((doc: SavedDocument) => (
                <TouchableOpacity
                  key={doc.id}
                  style={styles.documentItemTouchable}
                  onPress={() => {
                    setSelectedDoc(doc);
                    setModalVisible(true);
                  }}
                  activeOpacity={0.85}
                >
                  <View style={styles.documentItemCard}>
                    <View style={styles.documentIconBar} />
                    <View style={styles.documentInfoContentShort}>
                      <TranslatedText style={styles.documentLabel}>
                        Name:{" "}
                        <TranslatedText style={styles.documentValue}>
                          {doc.filename}
                        </TranslatedText>
                      </TranslatedText>
                      <TranslatedText style={styles.documentLabel}>
                        Size:{" "}
                        <TranslatedText style={styles.documentValue}>
                          {formatFileSize(doc.size)}
                        </TranslatedText>
                      </TranslatedText>
                      <TranslatedText style={styles.documentLabel}>
                        Date:{" "}
                        <TranslatedText style={styles.documentValue}>
                          {formatDate(doc.timestamp)}
                        </TranslatedText>
                      </TranslatedText>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteDocument(doc.id)}
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {userDocuments.length === 0 && (
        <View style={styles.emptyState}>
          <FileText size={48} color="#d1d5db" />
          <TranslatedText style={styles.emptyTitle}>
            No documents saved yet
          </TranslatedText>
          <TranslatedText style={styles.emptySubtitle}>
            Upload and save a document to get started
          </TranslatedText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    gap: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    backgroundColor: colors.primary.lightGreen,
    padding: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  saveButtonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 8,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PSBColors.primary.green,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  documentsSection: {
    gap: 12,
  },
  documentsTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  documentsListContainer: {
    maxHeight: 260,
    minHeight: 60,
  },
  documentsList: {
    flexGrow: 0,
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  documentContent: {
    flex: 1,
    gap: 4,
  },
  documentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  documentName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
    flex: 1,
  },
  sizeBadge: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  sizeBadgeText: {
    fontSize: 10,
    color: "#6b7280",
  },
  documentMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  documentDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  documentHash: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#6b7280",
  },
  deleteButton: {
    backgroundColor: "transparent",
    padding: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  emptySubtitle: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
  },
  documentItemTouchable: {
    marginBottom: 18,
  },
  documentItemCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
  },
  documentIconBar: {
    width: 6,
    height: "100%",
    backgroundColor: PSBColors.primary.green,
    borderRadius: 4,
    marginRight: 12,
  },
  documentInfoContent: {
    flex: 1,
    gap: 4,
  },
  documentLabel: {
    color: "#6b7280",
    fontWeight: "500",
    fontSize: 13,
    marginBottom: 2,
  },
  documentValue: {
    color: "#1f2937",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    alignItems: "flex-start",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3b82f6",
    marginBottom: 16,
  },
  modalLabel: {
    color: "#6b7280",
    fontWeight: "500",
    fontSize: 15,
    marginBottom: 4,
  },
  modalValue: {
    color: "#1f2937",
    fontWeight: "600",
  },
  closeButton: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  documentInfoContentShort: {
    flex: 1,
    gap: 4,
  },
});
