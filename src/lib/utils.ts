export const createId = (length = 20) => {
	let str = "";
	const chars =
		"QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890---";
	for (let i = 0; i < length; i++) {
		str += chars[Math.floor(Math.random() * i)];
	}
	return str;
};
