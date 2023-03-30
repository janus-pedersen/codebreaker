import { PORTS } from "./../../utils/ports";
import { Ip } from "../../types";
import { Command } from "../Command";
import { CommandManager } from "../CommandManager";
import { StringInput } from "../inputs/StringInput";
import { SystemCommandFile } from "../SystemCommandFile";

export const ftp = new Command("ftp")
  .setDescription(
    "Send a file to another system, can be used to transfer commands"
  )
  .setCategory("Network")
  .setRoot()
  .setSuspicion(5)
  .addInput(new StringInput("ip", "IP Address to send to", true))
  .addInput(new StringInput("file", "File to send", true))
  .onExec((system, ip, file) => {
    const target = system.network?.get(ip! as Ip);
    if (!target) throw Error("No system found with that IP");
    const fileObj = system.getFile(file!);
    if (!fileObj) throw Error("No file found with that name");

    if (
      !system.firewall.canAccess(target.ip, PORTS.FILE_TRANSFER, "outbound") ||
      !target.firewall.canAccess(system.ip, PORTS.FILE_TRANSFER, "inbound")
    ) {
      throw Error("Access denied, firewall blocked file transfer");
    }

    if (fileObj.owner?.name !== system.user.name) {
      throw Error(
        `You do not own this file. Only '${fileObj.owner?.name}' can send this file.`
      );
    }

    target.files.addFile(fileObj);
    if (fileObj instanceof SystemCommandFile) {
      target.commandManager.addCommand(fileObj.command);
    }

    system.terminal.success(`File sent to ${target.name}`, false);
  });

CommandManager.addDefaultCommand(ftp);
