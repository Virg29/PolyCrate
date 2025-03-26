import { NodeCommandsSpecification, DataType } from "@adamtypes";

export const mockNodeCommands: NodeCommandsSpecification = {
  "FC": {
    "read": {
      "request": {
        "headers": {
          "to": DataType.TO,
          "from": DataType.FROM,
          "length": DataType.LENGTH,
          "command": DataType.COMMAND
        },
        "fields": {},
        "raw": ""
      },
      "response": {
        "headers": {
          "to": DataType.TO,
          "from": DataType.FROM,
          "length": DataType.LENGTH,
          "command": DataType.COMMAND,
          "ack": DataType.ACK,
          "status": DataType.STATUS
        },
        "fields": {
          "partNumber": {
            "parser": "AsciiParser",
            "isArray": true,
            "dataType": DataType.ASCII,
            "length": 10,
            "positionIndex": 0
          },
          "drawingNumber": {
            "parser": "AsciiParser",
            "isArray": true,
            "dataType": DataType.ASCII,
            "length": 5,
            "positionIndex": 1
          },
          "releaseType": {
            "parser": "AsciiParser",
            "isArray": true,
            "dataType": DataType.ASCII,
            "length": 1,
            "positionIndex": 2
          },
          "alphanumericCharacter": {
            "parser": "AsciiParser",
            "isArray": true,
            "dataType": DataType.ASCII,
            "length": 1,
            "positionIndex": 3
          },
          "releaseNumber": {
            "parser": "AsciiParser",
            "isArray": true,
            "dataType": DataType.ASCII,
            "length": 3,
            "positionIndex": 4
          }
        },
        "raw": ""
      },
    }
  },
  "E9": {
    "read": {
      "request": {
        "headers": {
          "to": DataType.TO,
          "from": DataType.FROM,
          "length": DataType.LENGTH,
          "command": DataType.COMMAND
        },
        "fields": {},
        "raw": ""
      },
      "response": {
        "headers": {
          "to": DataType.TO,
          "from": DataType.FROM,
          "length": DataType.LENGTH,
          "command": DataType.COMMAND,
          "ack": DataType.ACK,
          "status": DataType.STATUS
        },
        "fields": {
          "hour": {
            "parser": "UnsignedIntParser",
            "isArray": false,
            "dataType": DataType.UNSIGNED_CHAR,
            "positionIndex": 0
          },
          "minute": {
            "parser": "UnsignedIntParser",
            "isArray": false,
            "dataType": DataType.UNSIGNED_CHAR,
            "positionIndex": 1
          },
          "second": {
            "parser": "UnsignedIntParser",
            "isArray": false,
            "dataType": DataType.UNSIGNED_CHAR,
            "positionIndex": 2
          },
          "month": {
            "parser": "UnsignedIntParser",
            "isArray": false,
            "dataType": DataType.UNSIGNED_CHAR,
            "positionIndex": 3
          },
          "mday": {
            "parser": "UnsignedIntParser",
            "isArray": false,
            "dataType": DataType.UNSIGNED_CHAR,
            "positionIndex": 4
          },
          "year": {
            "parser": "UnsignedIntParser",
            "isArray": false,
            "dataType": DataType.UNSIGNED_CHAR,
            "positionIndex": 5
          }
        },
        "raw": ""
      },
      "name": "E9 Read Time Command",
      "description": "Reads the volatile calendar time.",
      "timeout": 200
    },
    "write": {
      "request": {
        "headers": {
          "to": DataType.TO,
          "from": DataType.FROM,
          "length": DataType.LENGTH,
          "command": DataType.COMMAND
        },
        "fields": {
          "hour": {
            "parser": "UnsignedIntParser",
            "isArray": false,
            "dataType": DataType.UNSIGNED_CHAR,
            "positionIndex": 0
          },
          "minute": {
            "parser": "UnsignedIntParser",
            "isArray": false,
            "dataType": DataType.UNSIGNED_CHAR,
            "positionIndex": 1
          },
          "second": {
            "parser": "UnsignedIntParser",
            "isArray": false,
            "dataType": DataType.UNSIGNED_CHAR,
            "positionIndex": 2
          },
          "month": {
            "parser": "UnsignedIntParser",
            "isArray": false,
            "dataType": DataType.UNSIGNED_CHAR,
            "positionIndex": 3
          },
          "mday": {
            "parser": "UnsignedIntParser",
            "isArray": false,
            "dataType": DataType.UNSIGNED_CHAR,
            "positionIndex": 4
          },
          "year": {
            "parser": "UnsignedIntParser",
            "isArray": false,
            "dataType": DataType.UNSIGNED_CHAR,
            "positionIndex": 5
          }
        },
        "raw": ""
      },
      "response": {
        "headers": {
          "to": DataType.TO,
          "from": DataType.FROM,
          "length": DataType.LENGTH,
          "command": DataType.COMMAND,
          "ack": DataType.ACK,
          "status": DataType.STATUS
        },
        "fields": {},
        "raw": ""
      },
      "name": "E9 Write Time Command",
      "description": "Writes the volatile calendar time.",
      "timeout": 200
    }
  },
  "7A": {
    "read": {
      "request": {
        "headers": {
          "to": DataType.TO,
          "from": DataType.FROM,
          "length": DataType.LENGTH,
          "command": DataType.COMMAND
        },
        "fields": {},
        "raw": ""
      },
      "response": {
        "headers": {
          "to": DataType.TO,
          "from": DataType.FROM,
          "length": DataType.LENGTH,
          "command": DataType.COMMAND,
          "ack": DataType.ACK,
          "status": DataType.STATUS
        },
        "fields": {
          "asoin_1": {
            "parser": "UnsignedIntParser",
            "isArray": true,
            "dataType": DataType.ASCII,
            "length": 256,
            "positionIndex": 0
          },
          "asoin_2": {
            "parser": "UnsignedIntParser",
            "isArray": true,
            "dataType": DataType.ASCII,
            "length": 256,
            "positionIndex": 1
          },
          "asoin_3": {
            "parser": "UnsignedIntParser",
            "isArray": true,
            "dataType": DataType.ASCII,
            "length": 256,
            "positionIndex": 2
          },
          "asoin_4": {
            "parser": "UnsignedIntParser",
            "isArray": true,
            "dataType": DataType.ASCII,
            "length": 256,
            "positionIndex": 3
          }
        },
        "raw": ""
      },
      "name": "7A Test DAC/ADC Command",
      "description": "This command tests the D/A and A/D hardware on the microprocessor by ramping outputs and reading inputs.",
      "timeout": 2000
    }
  }
};
