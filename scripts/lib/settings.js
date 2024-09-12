export const registerSettings = function() {
	// Register any custom module settings here
	let modulename = "about-time";
  
	game.settings.register(modulename, "debug", {
		name: "Debug output",
		hint: "Debug output",
		type: Boolean,
		default: false,
		scope: 'world',
		config: true,
        requiresReload: true
	});
}
