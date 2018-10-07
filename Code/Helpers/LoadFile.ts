export function loadFileAsJSON(input: React.ChangeEvent<HTMLInputElement>["target"], onLoaded): any {
    
    if (input != null && input.files && input.files.length > 0) {
        const fileToLoad = input.files[0]
    
        const fileReader = new FileReader()
        fileReader.readAsText(fileToLoad, "UTF-8");
        fileReader.onload = function(fileLoadedEvent) {
            // @ts-ignore
            const textFromFileLoaded = fileLoadedEvent.target.result
            try { 
                const data = JSON.parse(textFromFileLoaded) 
                onLoaded(data)
            } 
            catch (e) { alert("Not a valid file.\n" + e) }
        }
    }
}