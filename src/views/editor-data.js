export default {
  title: "This title",
  description: "This description",
  steps: [
    {
      id: 1,
      type: "start",
      connect: [
        {
          stepId: 2,
          dstInPort: "test"
        }
      ],
      canvas: {
        position: [50, 50]
      }
    },
    {
      id: 2,
      type: "single",
      name: "Response",
      props: { a: 1, b: 2 },
      handlerFile: "./handler.js",
      ports: {
        in: ["test"],
        out: ["test2"]
      },
      connect: [{ stepId: 3 }],
      canvas: {
        position: [150, 50],
        color: "#1795D4"
      }
    },
    {
      id: 4,
      type: "single",
      name: "Response",
      props: { a: 1, b: 2 },
      handlerFile: "./handler2.js",
      ports: {
        in: ["test"],
        out: ["test2"]
      },
      canvas: {
        position: [300, -250]
      }
    },
    {
      id: 3,
      type: "end",
      canvas: {
        position: [600, 150]
      }
    },
    {
      type: "end",
      canvas: {
        position: [400, 150]
      }
    },
    {
      type: "error",
      canvas: {
        position: [10, 10]
      }
    }
  ]
};
