import { React, ReactNative } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { showConfirmationAlert } from "@vendetta/ui/alerts";
import { Forms } from "@vendetta/ui/components";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { getTranslation } from "./translations.js";
import ItemWithRemove from "../../helpers/ui/ItemWithRemove.jsx";
import { findByStoreName, findByProps } from "@vendetta/metro";
let UserStore;

export default (props) => {
	UserStore ??= findByStoreName("UserStore");
	useProxy(storage);
	const [users, setUsers] = React.useState(storage["ignore"]["users"]);

	const handleRemoveUser = (userId) => {
		const newArr = users.filter((id) => id !== userId);
		storage["ignore"].users = newArr
		setUsers(newArr)
	};
	const handleClearUsers = () => {
		storage["ignore"].users = [];
		setUsers([]);
	};

	return (
		<ReactNative.ScrollView style={{ flex: 1 }}>
			<Forms.FormSection title={getTranslation("settings.titles.settings")} titleStyleType="no_border">
				<Forms.FormRow label={getTranslation("settings.showTimestamps")} trailing={<Forms.FormSwitch value={storage.timestamps} onValueChange={(v) => (storage.timestamps = v)} />} />
				<Forms.FormRow label={getTranslation("settings.ewTimestampFormat")} trailing={<Forms.FormSwitch value={storage["ew"]} onValueChange={(v) => (storage.ew = v)} />} />
				<Forms.FormDivider />
				<Forms.FormRow label={getTranslation("settings.youDeletedItWarning")} />
			</Forms.FormSection>
			<Forms.FormSection title={getTranslation("settings.titles.filters")}>
				<Forms.FormRow label={getTranslation("settings.ignoreBots")} trailing={<Forms.FormSwitch value={storage["ignore"].bots} onValueChange={(value) => (storage["ignore"].bots = value)} />} />
				<Forms.FormRow
					label={getTranslation("settings.clearUsersLabel", true)?.make?.(users.length)}
					trailing={<Forms.FormRow.Icon source={getAssetIDByName("ic_trash_24px")} />}
					onPress={() => {
						if (users.length !== 0)
							showConfirmaionAlert({
								title: getTranslation("settings.confirmClear.title"),
								content: getTranslation("settings.confirmClear.description", true)?.make?.(users.length),
								confirmText: getTranslation("settings.confirmClear.yes"),
								cancelText: getTranslation("settings.confirmClear.no"),
								confirmColor: "brand",
								onConfirm: handleClearUsers
							});
					}}
				/>
				<ReactNative.ScrollView style={{ flex: 1, marginLeft: 15 }}>
					{users.map((id) => {
						const User = vendetta.metro.findByStoreName("UserStore").getUser(id);
						const pfp = User.getAvatarURL().replace(/\.(gif|webp)/, ".png");

						return (
							<ItemWithRemove
								imageSource={{ uri: pfp }}
								onImagePress={() => {}}
								onRemove={() => handleRemoveUser(id)}
								label={User.username + (User.discriminator == 0 ? "" : `#${User.discriminator}`)}
							/>
						);
					})}
				</ReactNative.ScrollView>
				<Forms.FormDivider />
				<Forms.FormRow label={getTranslation("settings.addUsersInfo")} />
			</Forms.FormSection>
		</ReactNative.ScrollView>
	);
};
