/* Initialise the log history & cursor position */
let machineName = "user@user ~ # "
let terminalHistoryLog = []
let cursorLogPosition = terminalHistoryLog.length
const userBirthday = "01/01/2000"

/* Set some core DOM items */
let terminalContainer = currentTerminalDiv = document.getElementsByClassName("terminal-container")[0]
let siteContainer = document.getElementsByClassName("site-container")[0]

/* These count the number of tables of a certain type present in the DOM */
let manTableCount = expTableCount = skiTableCount = 0

/* A structure of system commands used for the man pages and valid command list */
const commandData = [
    {
        "name": "hilfe",
        "description": "Zeigt alle hier möglichen Befehle an. Probiere sie aus!"
    },
    {
        "name": "wer",
        "description": "Informationen über mich."
    },
    {
        "name": "warum",
        "description": "Begründung für dieses Projekt."
    },
   
    {
        "name": "remix",
        "description": "Link zum Quellcode dieses Projekts für Remix."
    },
   
    {
        "name": "verlauf",
        "description": "Zeigt alle Befehle an, die bisher eingegeben wurden."
    },
    
    {
        "name": "clear",
        "description": "Startet die Session neu und löscht den Verlauf."
    },
    {
        "name": "kontakt",
        "description": "Zeigt eine Kontaktmöglichkeit an."
    },
    {
        "name": "exit",
        "description": "Beendet die aktuelle Sitzung."
    }
]



const werContent = "<p>Hallo. Ich bin Nele. Ich bin Bildungswissenschaftlerin und arbeite in dem von mir gegründeten eBildungslabor. Dies ist eine Initiative zur Unterstützung zeitgemäßer Bildung.</p>"

const remixContent = "<p>- 🖥️ Remixe Dir Deine eigene Website 🎉 -</p>" +
  "<p>Miniterm ist ein Open-Source Projekt von thomaskr, das ich hier für mch umgestaltet und angepasst habe. Du kannst es für Dich ebenfalls ganz einfach weiternutzen!</p>" +
  "<p>" +
  "<a href=\"https://github.com/thmsrmbld/miniterm\"target=\"_blank\">" +
  "miniterm.github</a>" +
  "</p>"

const warumContent = "<p>Dieses Projekt ist nur eine kleine Spielerei, um ein paar Infos von sich im Hacker-Terminal-Style' zu veröffentlichen. Und das Schöne daran ist, dass es sich ganz einfach remixen lässt. Tippe 'remix', um zum Quellcode zu gelangen.</p>"


const initialisePage = () => {
    /* Initialises the page. We just sequentially load in the initial page
     elements. We could do this with CSS, but ...here we are) */
    setTimeout(mockLogin, 400)
    setTimeout(mockCommands, 1000)
    setTimeout(loadUserInput, 1400)
    setTimeout(commandListener, 1600)
    setInterval("inputRefocus()", 1800)
}

const inputRefocus = () => {
    /* Refocuses the command line automatically if it falls out of focus */
    let commandLine = document.getElementsByClassName("terminal-input")[0]
    if (document.activeElement !== commandLine) {
        commandLine.focus()
    }
}

const commandListener = () => {
    /* Main command listener - processes and runs the keyboard input */
    let userInput = document.getElementsByClassName("terminal-input")[0]
    userInput.addEventListener("keyup", function(event) {

        /* First, we handle the ArrowUp event (but only if the cursor isn't
         already at the start of the array). Then, we handle the ArrowDown
         event (only if the cursor isn't already at the end of the array). */
        if (event.key === "ArrowUp" && cursorLogPosition > 1){
            cursorLogPosition -= 1
            userInput.value = terminalHistoryLog.slice(
              cursorLogPosition - 1
            )[0]
        }
        if (event.key === "ArrowDown" && cursorLogPosition < terminalHistoryLog.length){
            cursorLogPosition += 1
            userInput.value = terminalHistoryLog.slice(
              cursorLogPosition - 1
            )[0]
        }
        /* Otherwise, we handle the keyboard Enter event */
        else if (event.key === "Enter") {
            event.preventDefault()
            /* We need to transform the input for processing, but also
             want to store the raw data for later use */
            let rawInput = userInput.value
            let cleanedInput = userInput.value.toLowerCase()

            /* We only store non-blanks */
            if (rawInput !== "") {
                terminalHistoryLog.push(rawInput)
                cursorLogPosition = terminalHistoryLog.length + 1
            }
            /* Before processing input, write to the previous line on the screen */
            setPrevLine(rawInput)

            /* This is the main switch statement takes the cleaned input and
             decides which command to fire */
            switch(cleanedInput) {
                case "":
                    /* Do nothing */
                    break
                case "cd":
                    cdPrinter()
                    break
                case "clear":
                    clearTerminal()
                    break
                case "kontakt":
                    kontaktPrinter()
                    break
                case "exit":
                    window.open("https://ebildungslabor.de/")
                    break
           
                case "miniterm":
                case "github":
                      case "remix":
                    remixPrinter()
                    break
                case "verlauf":
                    verlaufPrinter(terminalHistoryLog)
                    break
                case "hilfe":
                case "help":
                    hilfePrinter(commandData)
                    break
                case "man":
                    hilfePrinter(commandData)
                    break
                case "warum":
                    warumPrinter(skillsData)
                    break
       
                case "wer":
                    werPrinter()
                    break
                default:
                    /* Otherwise, the command doesn't exist */
                    commandNotFoundPrinter(cleanedInput)
            }

            /* Finally, force a reset and re-focus of terminal input field */
            userInput.value = ""
            userInput.focus()
            terminalContainer.scrollIntoView(false)
        }
    })
}

const setPrevLine = (rawInput) => {
    /* Get the relevant DOM objects, and set the content of the previous
     terminal line */
    let previousLineDiv = document.createElement("div")
    previousLineDiv.innerHTML = machineName + rawInput
    previousLineDiv.setAttribute("class", "ag output-row green-hl")
    siteContainer.insertBefore(previousLineDiv, currentTerminalDiv)
}

const uptimePrinter = () => {
    /* Prints how long you've been alive in days since your birthday */
    let duration = new Date(userBirthday)
    let todaysDate = new Date()
    let daysDelta = todaysDate.getTime() - duration.getTime()
    daysDelta = daysDelta / (1000 * 3600 * 24)
    let timeNow = new Date().toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"})

    /* To display the final uptime */
    let uptimeDiv = document.createElement("p")
    uptimeDiv.setAttribute("class", "ag output-row")
    uptimeDiv.innerHTML = timeNow + " up " + Math.round((daysDelta + Number.EPSILON) * 100) + " days, 1 user, load averages: 5.24 5.18 5.42"
    siteContainer.insertBefore(uptimeDiv, currentTerminalDiv)
}



const manPrinter = (commandData) => {
    /* Prints man-pages to screen */
    manTableCount += 1

    /* Build title */
    let manStart = document.createElement("div")
    manStart.setAttribute("class", "ag output-row")
    manStart.innerHTML = " --- BSD General Commands Manual --- "
    siteContainer.insertBefore(manStart, currentTerminalDiv)

    /* Build table */
    let manTable = document.createElement("table")
    manTable.setAttribute("class", "mnTb" + manTableCount + " ag mnTable" +
      " output-row")
    siteContainer.insertBefore(manTable, currentTerminalDiv)

    let mnTable = document.getElementsByClassName("mnTb" + manTableCount)[0]
    let tdData = Object.keys(experienceData[0])
    generateTable(mnTable, commandData)
    siteContainer.insertBefore(mnTable, currentTerminalDiv)
}

const werPrinter = () => {
    /* Prints 'whois' details to screen */
    let werDiv = document.createElement("p")
    werDiv.innerHTML = werContent
    werDiv.setAttribute("class", "ag output-row")
    siteContainer.insertBefore(werDiv, currentTerminalDiv)
}

const githubPrinter = () => {
    /* Prints 'whois' details to screen */
    let githubDiv = document.createElement("p")
    githubDiv.innerHTML = githubContent
    githubDiv.setAttribute("class", "ag output-row")
    siteContainer.insertBefore(githubDiv, currentTerminalDiv)
}

const cdPrinter = () => {
    /* Prints 'cd' easter egg to screen */
    let cdDiv = document.createElement("p")
    cdDiv.innerHTML = "...cd? Where ya gonna change to, kid? This ain\'t a REAL machine..."
    cdDiv.setAttribute("class", "ag output-row")
    siteContainer.insertBefore(cdDiv, currentTerminalDiv)
}

const commandPrinter = (commandData) => {
    /* Builds a string of available commands and outputs to terminal */
    let commandArray = []

    commandData.forEach((command) => {
        commandArray.push(command.name)
    })

    let commandString = commandArray.join(", ")
    let lsDiv = document.createElement("div")
    lsDiv.innerHTML = commandString
    lsDiv.setAttribute("class", "ag output-row")
    siteContainer.insertBefore(lsDiv, currentTerminalDiv)
}

const commandNotFoundPrinter = (userInput, rawInput) => {
    /* We need to create two line outputs to emulate bash (the error is an
     extra line */
    let commandNotFoundDiv = document.createElement("div")
    commandNotFoundDiv.innerHTML = "-bash: " + rawInput + ": command not found"
    commandNotFoundDiv.setAttribute("class", "ag output-row")
    siteContainer.insertBefore(commandNotFoundDiv, currentTerminalDiv)
}

const contactPrinter = () => {
    /* Prints contact details to screen */
    let contactDiv = document.createElement("div")
    let email = "user@email.com"
    contactDiv.innerHTML = '📧 <a href="mailto: ' + email + '?subject=Hello, Thomas!" target="_blank">' + email + '</a>'
    contactDiv.setAttribute("class", "ag output-row")
    siteContainer.insertBefore(contactDiv, currentTerminalDiv)
}

const historyPrinter = (terminalHistoryLog) => {
    /* Prints terminal history to screen */
    terminalHistoryLog.forEach((entryItem, index) => {
        let historyOutputRow = document.createElement("div")
        historyOutputRow.innerHTML = (index + 1) + " " + entryItem
        historyOutputRow.setAttribute("class", "ag output-row")
        siteContainer.insertBefore(historyOutputRow, currentTerminalDiv)
    })
}

const clearTerminal = () => {
    /* All autogenerated output has the class "ag", so we just delete those */
    let agLines = document.getElementsByClassName("ag")
    while(agLines[0]){
        agLines[0].parentNode.removeChild(agLines[0])
    }
    /* Null the count of active tables now in the DOM, cause they're all gone */
     expTableCount = skiTableCount = manTableCount = 0
}

const mockLogin = () => {
    /* Micro function for mocking the 'login' process, called on first page
     load timer */
    let todaysDate = new Date()
    document.getElementsByClassName("login-time")[0].innerHTML = "Last login: " + todaysDate.toLocaleString() + " on ttys001"
}

const mockCommands = () => {
    /* Micro function for showing which commands are available, called on
     first page load timer */
    const instructionText = "- 💻 tippe 'hilfe', um mögliche Befehle angezeigt zu bekommen. Navigiere mit ⬆️ & ⬇️ Pfeilen" +
      " cycle command history -"
    document.getElementsByClassName("command-list")[0].innerHTML = instructionText
}

const loadUserInput = () => {
    /* Colors the terminal input element and creates the input on load */
    terminalContainer.style.backgroundColor = "rgba(0, 255, 0, 0.06)"
    let userInput = document.createElement("input")
    userInput.setAttribute("type", "text")
    userInput.setAttribute("class", "terminal-input")
    userInput.setAttribute("autofocus", "autofocus")
    document.getElementsByClassName("machine-name")[0].innerHTML = machineName
    terminalContainer.appendChild(userInput)
}
/* Just calls and runs the whole system :) */
initialisePage()
