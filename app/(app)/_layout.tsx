import { Drawer } from "expo-router/drawer";
import { CustomDrawerContent } from "@/components/CustomDrawerContent";

export default function AppLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerPosition: "right",
        drawerType: "front",
        drawerStyle: { width: "78%" },
      }}
    >
      <Drawer.Screen name="customers" />
      <Drawer.Screen name="templates" />
    </Drawer>
  );
}
