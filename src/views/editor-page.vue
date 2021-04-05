<template>
  <v-editor :value="value" />
</template>

<script>
const pipeline = {
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
      canvasPosition: [10, 20]
    },
    {
      id: 2,
      type: "single",
      name: "Response",
      props: { a: 1, b: 2 },
      handler: "var a = 1;",
      ports: {
        in: ["test"],
        out: ["test2"]
      },
      connect: [{ stepId: 3 }]
    },
    {
      id: 3,
      type: "end"
    }
  ]
};

export default {
  name: "editor-page",
  data() {
    return {
      value: JSON.stringify(pipeline)
    };
  }
};
</script>
