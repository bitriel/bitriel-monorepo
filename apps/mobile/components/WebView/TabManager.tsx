// TabManager.tsx
import React, { useState } from "react";
import { View, Button, FlatList, TouchableOpacity, Text, StyleSheet } from "react-native";
import MiniBrowser from "./MiniBrowser";

interface Tab {
  id: number;
  url: string;
}

const TabManager: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([{ id: 1, url: "https://www.google.com" }]);
  const [activeTab, setActiveTab] = useState<number>(1);

  const addTab = () => {
    const newId = tabs.length ? Math.max(...tabs.map((tab) => tab.id)) + 1 : 1;
    setTabs([...tabs, { id: newId, url: "https://www.google.com" }]);
    setActiveTab(newId);
  };

  const closeTab = (id: number) => {
    const filteredTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(filteredTabs);
    if (activeTab === id && filteredTabs.length) {
      setActiveTab(filteredTabs[0].id);
    }
  };

  const updateTabUrl = (id: number, url: string) => {
    setTabs(tabs.map((tab) => (tab.id === id ? { ...tab, url } : tab)));
  };

  const renderTab = ({ item }: { item: Tab }) => (
    <TouchableOpacity onPress={() => setActiveTab(item.id)}>
      <Text style={[styles.tab, item.id === activeTab && styles.activeTab]}>Tab {item.id}</Text>
      <Button title="x" onPress={() => closeTab(item.id)} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList horizontal data={tabs} renderItem={renderTab} keyExtractor={(item) => item.id.toString()} style={styles.tabList} />
      <Button title="New Tab" onPress={addTab} />
      {tabs.map((tab) => tab.id === activeTab && <MiniBrowser key={tab.id} initialUrl={tab.url} onUrlChange={(url) => updateTabUrl(tab.id, url)} />)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabList: {
    flexDirection: "row",
    backgroundColor: "#ddd"
  },
  tab: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#aaa"
  },
  activeTab: {
    backgroundColor: "#fff"
  }
});

export default TabManager;
