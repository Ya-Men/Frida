var CreateFileW = Module.getExportByName(null, "CreateFileW"); // Hook CreateFileW from the desired process 

// Changing the destination file to Create, hence changing where the program will write
Interceptor.attach(CreateFileW, {

  onEnter(args) {
    /*
    CreateFileW Prototype
    
    HANDLE CreateFileW(
      [in]           LPCWSTR               lpFileName,
      [in]           DWORD                 dwDesiredAccess,
      [in]           DWORD                 dwShareMode,
      [in, optional] LPSECURITY_ATTRIBUTES lpSecurityAttributes,
      [in]           DWORD                 dwCreationDisposition,
      [in]           DWORD                 dwFlagsAndAttributes,
      [in, optional] HANDLE                hTemplateFile
    );
    */

    var lpFileName = args[0],
    dwDesiredAccess = args[1],
    dwShareMode = args[2]
    
    // console.log("\nargs[0] -> lpFileName addr: " + args[0]);
    // console.log("\nargs[0] -> lpFileName hexdump: " + hexdump(args[0]));


    /* 
      `Memory.scanSync()` uses space seperated hex to find string in memory
      lpFileName / args[0] is of type LPCWSTR, essentially means that each char takes two bytes (Similar to UTF-16LE in PowerShell)
    */

    // C:\Users\YairMentesh\Desktop\t.txt
    const fileHex = "43 00 3a 00 5c 00 55 00 73 00 65 00 72 00 73 00 5c 00 59 00 61 00 69 00 72 00 4d 00 65 00 6e 00 74 00 65 00 73 00 68 00 5c 00 44 00 65 00 73 00 6b 00 74 00 6f 00 70 00 5c 00 74 00 2e 00 74 00 78 00 74 00";
    
    // C:\Users\YairMentesh\Desktop\s.txt
    const fileTamperHex = [0x43, 0x00, 0x3a, 0x00, 0x5c, 0x00, 0x55, 0x00, 0x73, 0x00, 0x65, 0x00, 0x72, 0x00, 0x73, 0x00, 0x5c, 0x00, 0x59, 0x00, 0x61, 0x00, 0x69, 0x00, 0x72, 0x00, 0x4d, 0x00, 0x65, 0x00, 0x6e, 0x00, 0x74, 0x00, 0x65, 0x00, 0x73, 0x00, 0x68, 0x00, 0x5c, 0x00, 0x44, 0x00, 0x65, 0x00, 0x73, 0x00, 0x6b, 0x00, 0x74, 0x00, 0x6f, 0x00, 0x70, 0x00, 0x5c, 0x00, 0x73, 0x00, 0x2e, 0x00, 0x74, 0x00, 0x78, 0x00, 0x74, 0x00];

    // Memory.scanSync(ptr, bytes length to scan, content to search)
    const results = Memory.scanSync(args[0], 136, fileHex);

    var addr, size;
    if (results[0] !== undefined) { 
      // console.log(JSON.stringify(results)); 
      
      addr = results[0]["address"],
      size = results[0]["size"]
      console.log(`found addr in ${addr} with size of ${size}`);
      console.log("Changing the destination file");

      // Changing lpFileName to point to a different file 
      lpFileName.writeByteArray(fileTamperHex);
    }

    /*
    Same as `Memory.scanSync()` but Asynchronous 
    
    Memory.scan(args[0], 136, "43 00 3a 00 5c 00 55 00 73 00 65 00 72 00 73 00 5c 00 59 00", {
      onMatch(address, size) {
        console.log('Memory.scan() found match at', address,
        'with size', size);
         = address;

        // Optionally stop scanning early:
        // return 'stop';
      },

      onComplete() {
        console.log('Memory.scan() complete');
      }
    });

  */

  },


  onLeave(retval) {
    // console.log(`retval: ${retval}\n`);
  }

});