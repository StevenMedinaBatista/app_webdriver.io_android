const commands = {};

//This is needed to make clicks on -image elements work properly
commands.performActions = async function (actions) {
  return await this.winAppDriver.sendCommand('/actions', 'POST', {actions});
};

Object.assign(commands);
export default commands;
