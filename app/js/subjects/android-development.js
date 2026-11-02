/* Subject: android-development
 *
 * Android app development for mainstream online learners — Kotlin, Android Studio, UI,
 * data, and publishing. No AI writing the app for you. Phase B of docs/12-expansion-map.md.
 */

(window.AIF_SUBJECTS = window.AIF_SUBJECTS || {})["android-development"] = function (h) {
  const { fieldsChallenge, critiqueChallenge, scenarioChallenge } = h;
  const AND_COMPETENCIES = [
  {
    id: "AND1", name: "Build and run a first Android app",
    canDo: "Create a new Android Studio project, build a simple UI with a button and text, run it on an emulator or device, and read the logcat output.",
    resources: [
      { title: "Android Basics with Compose (official)", url: "https://developer.android.com/courses/android-basics-compose/course", type: "official course", description: "Google's official free course — build your first Android apps with Jetpack Compose." },
      { title: "Android Studio overview (official)", url: "https://developer.android.com/studio/intro", type: "reference", description: "The official IDE tour — project structure, editor, emulator, logcat." },
      { title: "Kotlin for Android (official)", url: "https://developer.android.com/kotlin", type: "reference", description: "Kotlin language guide for Android development." },
    ],
    selfCheck: [
      "Can I create a new Empty Compose Activity project in Android Studio?",
      "Can I add a Button and a Text to the screen and change what they show?",
      "Can I run the app on an emulator or physical device?",
      "Can I open logcat and find my app's output there?",
    ],
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A beginner copied code from a tutorial into MainActivity.kt but the app crashed on launch. They hadn't set the content in setContent, and the tutorial assumed an older project template. They spent an hour 'fixing' code that was fine — the problem was the project setup.",
        point: "Match the tutorial to your project template. The template decides what code belongs where.",
      },
      explain: {
        paras: [
          "Start from the Empty Compose Activity template — it sets up setContent and the theme for you.",
          "The UI is described in Kotlin with Compose functions, not XML layouts (in modern Android).",
          "Run on the emulator first, then a physical device with developer options and USB debugging on.",
          "Logcat shows crashes and your own Log.d output — it's the first place to look when something goes wrong.",
        ],
        keyIdea: "Empty Compose Activity template → Compose UI in Kotlin → run on emulator/device → check logcat.",
      },
      demonstrate: {
        task: "Make a screen that shows 'Hello' and a button that changes it to 'Clicked'.",
        steps: [
          { move: "Create Empty Compose Activity project", think: "File → New Project → Empty Compose Activity.", result: "project with MainActivity.kt and setContent." },
          { move: "Add state for the text", think: "remember { mutableStateOf('Hello') }.", result: "a state variable holding the screen text." },
          { move: "Show the text and a button", think: "Text(text) and Button(onClick = { ... }).", result: "a screen with the text and a tappable button." },
          { move: "Run on the emulator", think: "Run → select device → wait for it to launch.", result: "app running, button changes text when tapped." },
        ],
        full: "Empty Compose Activity project, state holds 'Hello', Text + Button in Compose, run on emulator, tapping the button sets the text to 'Clicked'.",
      },
      deconstruct: [
        "The template handles setContent — you only write what goes inside it.",
        "State (mutableStateOf) is what makes the screen change when the button is tapped.",
        "Running on the emulator is the real test — code that compiles isn't necessarily code that runs.",
        "Logcat is the crash log — check it before guessing why the app stopped.",
      ],
      guided: {
        intro: "Your turn. Build this, then compare with the model answer.",
        task: "Add a second button that resets the text back to 'Hello'.",
        fields: [
          { key: "addition", label: "What you added", hint: "The second button and its action.", minWords: 6 },
          { key: "runs", label: "Whether it runs on the emulator/device", hint: "Yes/no and what happened.", minWords: 6 },
          { key: "logcat", label: "What you checked in logcat", hint: "Or note there were no crashes.", minWords: 6 },
        ],
        model: {
          addition: "A second Button with onClick = { text = 'Hello' } next to the first one.",
          runs: "Yes — both buttons work on the emulator, text changes and resets.",
          logcat: "Opened logcat, filtered to the app, no crash output — the reset works cleanly.",
        },
      },
    },
    challenges: [
      fieldsChallenge("AND1.1", "Reproduce", "Build and run your own first screen",
        "Create a new Android Studio project and build a screen with at least one Text and one Button that does something visible. Run it on an emulator or device.",
        "Strong answer: a real project, runs without crashing, the button produces a visible change, and logcat was checked.",
        [
          { key: "project", label: "The project name/template", hint: "Empty Compose Activity.", minWords: 4 },
          { key: "screen", label: "What's on the screen", hint: "Text and button(s), what they show.", minWords: 8 },
          { key: "result", label: "What happened when you ran it", hint: "Ran or crashed — and what logcat showed.", minWords: 8 },
        ],
        [
          { label: "Real project that runs without crashing" },
          { label: "Button produces a visible change" },
          { label: "Logcat checked" },
        ],
        "independent"),
      scenarioChallenge("AND1.2", "Adapt", "The app crashes on launch",
        "You ran the app and it crashed immediately. You haven't changed anything since it compiled.",
        "What do you do?",
        [
          { id: "a", label: "Rewrite MainActivity.kt from scratch", ok: false, why: "You don't know the cause yet — rewriting blindly may keep the bug and lose what works." },
          { id: "b", label: "Open logcat, find the crash stack trace, and read the first line in your code", ok: true, why: "The stack trace points at the crashing line — start there." },
          { id: "c", label: "Uninstall and reinstall the app", ok: false, why: "That won't fix a code bug; it just hides it temporarily." },
        ],
        "transferable"),
    ],
  },
  {
    id: "AND2", name: "Handle user input and state",
    canDo: "Capture text input, react to button taps, and update the screen using Compose state — so the UI reflects what the user typed.",
    resources: [
      { title: "State in Jetpack Compose (official)", url: "https://developer.android.com/develop/ui/compose/state", type: "official docs", description: "How state works in Compose — remember, mutableStateOf, and state hoisting." },
      { title: "TextField basics (official)", url: "https://developer.android.com/develop/ui/compose/text/input", type: "official docs", description: "Capturing text input in Compose with TextField and onValueChange." },
      { title: "Compose by example (official codelab)", url: "https://developer.android.com/codelabs/jetpack-compose-basics", type: "codelab", description: "Hands-on codelab building stateful UIs in Compose." },
    ],
    selfCheck: [
      "Can I add a TextField and read what the user typed into it?",
      "Can I update the screen when the user taps a button, using state?",
      "Do I use remember { mutableStateOf(...) } so state survives recomposition?",
      "Can I explain what recomposition means in one sentence?",
    ],
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A beginner typed into a TextField but the screen never updated. They declared var text = '' inside the Composable — every recomposition reset it to empty. State lived in the wrong place.",
        point: "State must be remembered, not redeclared on every redraw. Otherwise the UI forgets everything the user typed.",
      },
      explain: {
        paras: [
          "Use var text by remember { mutableStateOf('') } so the value survives recomposition.",
          "Pass the value into TextField(value = text, onValueChange = { text = it }).",
          "When state changes, Compose recomposes the screen and shows the new value.",
          "Don't store UI state in a plain var inside the Composable — it resets every time.",
        ],
        keyIdea: "remember + mutableStateOf keeps state alive; plain var inside a Composable resets on every redraw.",
      },
      demonstrate: {
        task: "A TextField plus a Button that shows 'You typed: [what they wrote]'.",
        steps: [
          { move: "Declare remembered state", think: "var text by remember { mutableStateOf('') }.", result: "state that survives recomposition." },
          { move: "Wire the TextField", think: "value = text, onValueChange = { text = it }.", result: "typing updates the state." },
          { move: "Show the typed text", think: "Text('You typed: $text').", result: "the screen reflects what was typed." },
          { move: "Run and type", think: "Confirm the text appears live.", result: "typing updates the screen immediately." },
        ],
        full: "remember { mutableStateOf('') } holds the text, TextField writes into it, Text reads it out — typing updates the screen live.",
      },
      deconstruct: [
        "remember keeps the value across recompositions — without it, every keystroke resets the field.",
        "onValueChange = { text = it } is how Compose receives user input.",
        "Reading state in Text means the screen is always in sync with what's stored.",
      ],
      guided: {
        intro: "Your turn. Build this, then compare.",
        task: "Add a 'Clear' button that resets the TextField to empty.",
        fields: [
          { key: "button", label: "What the Clear button does", hint: "The onClick action.", minWords: 5 },
          { key: "state", label: "How you kept the text in state", hint: "remember + mutableStateOf.", minWords: 6 },
          { key: "verify", label: "How you confirmed clearing works", hint: "Typed something, tapped Clear, observed empty.", minWords: 8 },
        ],
        model: {
          button: "Button(onClick = { text = '' }) labelled 'Clear'.",
          state: "var text by remember { mutableStateOf('') } at the top of the Composable.",
          verify: "Typed 'hello', tapped Clear, the TextField went empty and Text showed 'You typed: '.",
        },
      },
    },
    challenges: [
      fieldsChallenge("AND2.1", "Reproduce", "Capture and display real user input",
        "Build a screen where the user types their name and taps a button to see a greeting using that name.",
        "Strong answer: TextField captures input, button shows a personalised greeting, state survives recomposition, runs without crash.",
        [
          { key: "nameField", label: "The TextField setup", hint: "value + onValueChange with remembered state.", minWords: 8 },
          { key: "greeting", label: "The greeting shown", hint: "Uses the typed name.", minWords: 6 },
          { key: "result", label: "What happened when you ran it", hint: "Typed a name, tapped button, saw greeting.", minWords: 8 },
        ],
        [
          { label: "TextField captures input via remembered state" },
          { label: "Button shows a personalised greeting" },
          { label: "Runs without crashing" },
        ],
        "independent"),
      scenarioChallenge("AND2.2", "Create", "The text resets every time you type",
        "You typed into a TextField but each keystroke wipes it back to empty.",
        "What do you do?",
        [
          { id: "a", label: "The emulator is slow — wait longer", ok: false, why: "This is a state bug, not an emulator speed issue." },
          { id: "b", label: "The state is redeclared every recomposition — wrap it in remember { mutableStateOf(...) }", ok: true, why: "Without remember, Compose recreates the variable on every redraw." },
          { id: "c", label: "Delete and recreate the project", ok: false, why: "The template isn't the problem; the state declaration is." },
        ],
        "transferable"),
    ],
  },
  {
    id: "AND3", name: "Navigate between screens",
    canDo: "Move between two screens with a button, pass a small piece of data (e.g. a name) to the second screen, and show it there.",
    resources: [
      { title: "Navigation in Compose (official)", url: "https://developer.android.com/develop/ui/compose/navigation", type: "official docs", description: "NavHost, NavController, and navigating between Compose screens." },
      { title: "Pass data between screens (official)", url: "https://developer.android.com/develop/ui/compose/navigation#pass-data", type: "official docs", description: "Passing arguments through navigation routes in Compose." },
    ],
    selfCheck: [
      "Can I set up a NavHost with two screens and navigate between them?",
      "Can I pass a string argument (e.g. a name) from screen A to screen B?",
      "Can screen B read the argument and display it?",
      "Can I navigate back from screen B to screen A?",
    ],
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A beginner added a NavHost but the button didn't switch screens. They'd forgotten to assign a route to each composable and to call navController.navigate(route) on the button tap.",
        point: "Navigation needs three things: a route per screen, a NavHost, and a navigate() call.",
      },
      explain: {
        paras: [
          "Give each screen composable a route string (e.g. \"home\", \"profile\").",
          "Wrap screens in a NavHost with a startDestination and a composable per route.",
          "Get a NavController with rememberNavController() and call navigate(\"profile\") on a button tap.",
          "Pass data as a route argument: \"profile/{name}\", and read it with navBackStackEntry.arguments.",
        ],
        keyIdea: "Route per screen + NavHost + navigate() call = screen switching. Arguments carry data between screens.",
      },
      demonstrate: {
        task: "Home screen with a name field and 'Go' button → profile screen shows 'Hello, [name]'.",
        steps: [
          { move: "Define routes", think: "\"home\" and \"profile/{name}\".", result: "two route strings." },
          { move: "Build NavHost", think: "NavHost(startDestination = \"home\") { composable(\"home\") { ... } composable(\"profile/{name}\") { ... } }.", result: "navigation graph set up." },
          { move: "Navigate on button tap", think: "navController.navigate(\"profile/$name\").", result: "tapping Go moves to the profile screen with the name." },
          { move: "Read the argument on profile", think: "navBackStackEntry.arguments?.getString(\"name\").", result: "the name shows on screen B." },
        ],
        full: "Routes 'home' and 'profile/{name}', NavHost with startDestination 'home', navigate('profile/' + name) on tap, read the argument on the profile screen.",
      },
      deconstruct: [
        "The route string is the address of each screen — NavHost matches it to the composable.",
        "navigate() is the action that changes screens — the button alone doesn't do it.",
        "Route arguments ({name}) carry data; navBackStackEntry reads them on arrival.",
      ],
      guided: {
        intro: "Your turn. Add a back button to screen B, then compare.",
        task: "On the profile screen, add a 'Back' button that returns to the home screen.",
        fields: [
          { key: "back", label: "What the Back button calls", hint: "navController.popBackStack().", minWords: 4 },
          { key: "works", label: "Whether tapping Back returns to home", hint: "Yes/no and what happened.", minWords: 6 },
          { key: "data", label: "Whether the name still shows going forward", hint: "Confirmed round-trip.", minWords: 6 },
        ],
        model: {
          back: "Button(onClick = { navController.popBackStack() }) labelled 'Back'.",
          works: "Yes — tapping Back returns to the home screen.",
          data: "Confirmed — typing a name, going to profile, then back still works.",
        },
      },
    },
    challenges: [
      fieldsChallenge("AND3.1", "Reproduce", "Navigate with real data",
        "Build two screens: screen A collects a name, screen B shows a personalised message using it. Navigate both ways.",
        "Strong answer: name passed as a route argument, screen B reads and displays it, back navigation works, runs without crash.",
        [
          { key: "routes", label: "The two routes you used", hint: "e.g. 'home' and 'greet/{name}'.", minWords: 6 },
          { key: "passed", label: "How you passed the name", hint: "Route argument on navigate().", minWords: 6 },
          { key: "shown", label: "What screen B displays", hint: "The personalised message.", minWords: 6 },
        ],
        [
          { label: "Name passed as a route argument" },
          { label: "Screen B reads and displays it" },
          { label: "Back navigation works" },
        ],
        "independent"),
      scenarioChallenge("AND3.2", "Adapt", "Navigating to a screen that doesn't exist",
        "You call navigate(\"settings\") but no route named 'settings' is in the NavHost.",
        "What do you do?",
        [
          { id: "a", label: "Add another navigate call to try again", ok: false, why: "Retrying the same invalid route crashes the same way." },
          { id: "b", label: "Add a composable(\"settings\") { ... } to the NavHost, then navigate", ok: true, why: "The route must exist in the navigation graph before you can navigate to it." },
          { id: "c", label: "Ignore it — it'll work on a real device", ok: false, why: "An unknown route crashes on emulator and device alike." },
        ],
        "transferable"),
    ],
  },
  {
    id: "AND4", name: "Publish to the Play Store (basics)",
    canDo: "Generate a signed release bundle, understand the Play Console listing steps, and know what testing tracks exist before public release.",
    resources: [
      { title: "Publish your app (official)", url: "https://developer.android.com/distribute/publish", type: "official docs", description: "End-to-end Play Store publishing: signing, bundles, console, release tracks." },
      { title: "App signing (official)", url: "https://developer.android.com/studio/publish/app-signing", type: "official docs", description: "Signing configs, upload keys, and Play App Signing." },
      { title: "Closed testing track (official)", url: "https://support.google.com/googleplay/android-developer/answer/9862396", type: "reference", description: "Closed testing track for testing with a small group before public release." },
    ],
    selfCheck: [
      "Can I generate a signed AAB (release bundle) in Android Studio?",
      "Do I know the difference between debug and release signing?",
      "Can I list the main Play Console listing items (title, description, screenshots, privacy policy)?",
      "Do I know what a closed testing track is for?",
    ],
    lesson: {
      activate: {
        heading: "When this goes wrong",
        story: "A developer tried to upload a debug APK to the Play Console and it was rejected. Debug builds can't be published — release requires a signed AAB with an upload key.",
        point: "The Play Store only accepts signed release bundles — debug builds won't upload.",
      },
      explain: {
        paras: [
          "Build → Generate Signed Bundle / APK → choose Android App Bundle (AAB), not APK.",
          "Create or select an upload keystore — this signs the release, and Play App Signing manages the actual app-signing key after upload.",
          "Release is not instant: create a release, add notes, choose a track (internal/closed/open/production), then review and roll out.",
          "The Play Console listing needs app title, short/long description, screenshots, and a privacy policy before review.",
        ],
        keyIdea: "Signed AAB → upload keystore → Play Console release track → listing details → roll out.",
      },
      demonstrate: {
        task: "Prepare a release for closed testing.",
        steps: [
          { move: "Generate signed AAB", think: "Build → Generate Signed Bundle / APK → Android App Bundle.", result: "a release.aab file signed with the upload keystore." },
          { move: "Upload to Play Console", think: "Create release → internal/closed testing track.", result: "AAB uploaded to a test track." },
          { move: "Add testers", think: "Email list or Google Group.", result: "testers can install from the Play Store." },
          { move: "Review and roll out", think: "Check release notes and track rules.", result: "release ready for the test group." },
        ],
        full: "Signed AAB generated, uploaded to the closed testing track, testers added via email, release notes added, rolled out to the test group.",
      },
      deconstruct: [
        "AAB, not APK — the Play Store's publishing format.",
        "The upload keystore signs the release; Google re-signs for delivery via Play App Signing.",
        "Tracks let you test with a small group before anyone public sees it.",
      ],
      guided: {
        intro: "Your turn. Outline your release plan, then compare.",
        task: "Write the steps you'd take to get this app onto a closed testing track.",
        fields: [
          { key: "bundle", label: "The build artifact", hint: "Signed AAB from Android Studio.", minWords: 5 },
          { key: "track", label: "Which track you'd use first", hint: "Internal or closed testing.", minWords: 5 },
          { key: "listing", label: "One listing item you'd need", hint: "Title, description, screenshot, or privacy policy.", minWords: 5 },
        ],
        model: {
          bundle: "Signed Android App Bundle (release.aab) built in Android Studio.",
          track: "Closed testing track with a small email list of testers first.",
          listing: "App title and at least one screenshot — required before the listing can be reviewed.",
        },
      },
    },
    challenges: [
      fieldsChallenge("AND4.1", "Reproduce", "Build a signed release bundle",
        "Generate a signed AAB for a real project. Show the build output location and the signing setup you used.",
        "Strong answer: a real signed AAB exists, the output path is named, and the keystore/signing choice is described.",
        [
          { key: "artifact", label: "The AAB file", hint: "Filename and location.", minWords: 6 },
          { key: "signing", label: "The keystore used", hint: "New or existing upload keystore.", minWords: 6 },
          { key: "format", label: "Why AAB not APK", hint: "Play Store requirement.", minWords: 6 },
        ],
        [
          { label: "A real signed AAB exists" },
          { label: "Keystore/signing described" },
          { label: "AAB-not-APB reasoning given" },
        ],
        "independent"),
      scenarioChallenge("AND4.2", "Adapt", "A tester reports the release crashes on their device",
        "Your closed-testing release installs but crashes on one tester's phone.",
        "What do you do?",
        [
          { id: "a", label: "Publish to production anyway — one device is an edge case", ok: false, why: "A crash on one device can be a crash on many; don't release untested." },
          { id: "b", label: "Get logcat from that device, reproduce, fix, and build a new test release", ok: true, why: "Reproduce on real device data before moving tracks." },
          { id: "c", label: "Ask the tester to clear app data and try again", ok: false, why: "That's a workaround, not a fix — the bug stays in the release." },
        ],
        "transferable"),
    ],
  },
  ];
  return { competencies: AND_COMPETENCIES, capstoneId: "ANDCAP" };
};
