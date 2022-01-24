var writeFile = Module.getExportByName(null, "WriteFile"); // Hook WriteFile from the desired process 

Interceptor.attach(writeFile, {

  onEnter(args) {
    console.log('\nEnter onEnter()\n');
    /*
    WriteFile ProtoType
    
    BOOL WriteFile(
    0  [in]                HANDLE       hFile,
    1  [in]                LPCVOID      lpBuffer,
    2  [in]                DWORD        nNumberOfBytesToWrite,
    3  [out, optional]     LPDWORD      lpNumberOfBytesWritten,
    4  [in, out, optional] LPOVERLAPPED lpOverlapped
    );
    */
    

    var hFile = args[0],
    lpBuffer = args[1],
    nNumberOfBytesToWrite = args[2],
    lpNumberOfBytesWritten = args[3],
    lpOverlapped = args[4];
    
    // console.log("\nargs[0] -> HANDLE: " + hFile);
    // console.log("args[1] -> lpBuffer Content: " + Memory.readCString(lpBuffer));
    // console.log("args[2] -> nNumberOfBytesToWrite: " + nNumberOfBytesToWrite);
    // console.log("args[3] -> lpNumberOfBytesWritten: " + lpNumberOfBytesWritten);
    // console.log("args[4] -> lpOverlapped: " + lpOverlapped);
    
    
    /* 
      Allocte memory in the heap and change the buffer content (Not so stable)
    */
    var newTextArr = [0x41, 0x42, 0x43, 0x44, 0x45]; // byteArray text
    var textArrSize = Memory.alloc(newTextArr.length); // Dynamiclly allocate memory at the HEAP
    textArrSize.writeByteArray(newTextArr); // Write byteArray to teh allocated memory
    args[1] = textArrSize; // Point lpBuffer to our newly created "string" in memory
    
    /* Or just use the line below */
    //args[1].writeByteArray("newTextArr");

 
    // console.log("lpBuffer modified to: " + Memory.readCString( args[1])); 
    console.log('Exit onEnter()\n');

  },


  onLeave(retval) {
    // retval is the status code as can be understood from `BOOL WriteFile(...);` return BOOL
    console.log(`retval: ${retval}\n`);
  }

});
