import { computed, watch, ref, toRaw } from "vue";
import { createEditHandler } from "./edit-handler";
import { ChangeNodeUserProp } from "./commands/change-node-user-prop";

export default function useNodeUserProps({ nodeModel, userPropsConfig, emit, editDelay }) {
  const fieldsByKey = ref({});
  const sortedFields = computed(() => {
    const array = Object.values(fieldsByKey.value);
    array.sort((a, b) => a.order - b.order);
    return array;
  });

  const changePropHandler = createEditHandler((nodeId, propName, value) =>
    ChangeNodeUserProp.createDef(nodeId, propName, value),
    emit,
    editDelay.value
  );

  const batchChangePropHandler = createEditHandler((params) =>
    params.map(({ nodeId, propName, value }) => ChangeNodeUserProp.createDef(nodeId, propName, value)),
    emit
  );

  watch(userPropsConfig, updateUserFields);
  watch(() => JSON.stringify(nodeModel.value.props), updatePropValues);

  function updateUserFields() {
    fieldsByKey.value = Object.entries(toRaw(userPropsConfig.value))
      .reduce((res, curr) => {
        let [propName, conf] = curr;
        res[propName] = {
          type: conf.type,
          prop: propName,
          label: conf.label ?? propName,
          value: getPropValue(propName, conf.default),
          order: conf.order ?? 0,
          enumOptions: toEnumOptions(conf.enum)
        }
        return res;
      }, {});
  }

  function updatePropValues() {
    const newValues = toRaw(nodeModel.value.props);
    const config = toRaw(userPropsConfig.value);
    const byKey = fieldsByKey.value;

    Object.keys(byKey).forEach(key => {
      if (key in newValues) {
        byKey[key].value = newValues[key];
      } else {
        byKey[key].value = config[key]?.default;
      }
    });
  }

  function getPropValue(propName, defaultValue) {
    if (propName in nodeModel.value.props) {
      return nodeModel.value.props[propName];
    }
    return defaultValue;
  }

  function toEnumOptions(enumArray) {
    if (!Array.isArray(enumArray)) {
      return [];
    }
    return enumArray.map(val => ({
      text: val,
      value: val
    }))
  }

  function onUpdateUserField(field, newValue) {
    field.value = newValue;
    changePropHandler(nodeModel.value.id, field.prop, newValue);
  }

  function onResetUserFieldDefaults() {
    const nodeId = nodeModel.value.id;
    const params = Object.keys(fieldsByKey.value).map(key => ({
      nodeId,
      propName: key,
      value: undefined
    }));
    batchChangePropHandler(params);
  }

  return {
    userFields: sortedFields,
    onResetUserFieldDefaults,
    onUpdateUserField
  }
}
