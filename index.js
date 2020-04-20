const core = require('@actions/core');

const PROGMEM_USAGE_REGEXP = /Sketch uses ([0-9]+) bytes \(([0-9]+)%\) of program storage space\. Maximum is ([0-9]+) bytes\./;
const RAM_USAGE_REGEXP = /Global variables use ([0-9]+) bytes \(([0-9]+)%\) of dynamic memory, leaving ([0-9-]+) bytes for local variables\. Maximum is ([0-9]+) bytes\./;

const parseProgmemUsage = (compileLog) => {
    const match = PROGMEM_USAGE_REGEXP.exec(compileLog);
    if (match) {
        const [, bytesStr, percentageStr, totalStr] = match;
        const progmemBytes = Number(bytesStr);
        const progmemPercentage = Number(percentageStr);
        const progmemTotal = Number(totalStr);
        return { progmemBytes, progmemPercentage, progmemTotal };
    }
    return {
        progmemBytes: null,
        progmemPercentage: null,
        progmemTotal: null,
    }
}
const parseRAMUsage = (compileLog) => {
    const match = RAM_USAGE_REGEXP.exec(compileLog);
    if (match) {
        const [, bytesStr, percentageStr, remainedStr, totalStr] = match;
        const ramBytes = Number(bytesStr);
        const ramPercentage = Number(percentageStr);
        const ramRemained = Number(remainedStr);
        const ramTotal = Number(totalStr);
        return { ramBytes, ramPercentage, ramRemained, ramTotal };
    }
    return {
        ramBytes: null,
        ramPercentage: null,
        ramRemained: null,
        ramTotal: null,
    }
}

const parseNumberOrNull = (str) => {
    if(str == null || !str.length) {
        return null;
    }
    const parsed = Number(str);
    if (Number.isNaN(parsed)) {
        return null;
    }
    return parsed;
}

/**
 *
 * @param {string} name
 * @param {number} value
 */
const setNumericOutput = (name, value) => {
    const valueStr = value ? value.toString(10) : '';
    console.log(`${name} = '${valueStr}'`)
    core.setOutput(name, valueStr);
}

/**
 *
 * @param {string} name
 * @param {boolean} value
 */
const setBooleanOutput = (name, value) => {
    const valueStr = value ? '1' : '0';
    console.log(`${name} = '${valueStr}'`)
    core.setOutput(name, valueStr);
}

try {
    const compileLog = core.getInput('compile-log');
    const progmemBytesTreshold = parseNumberOrNull(core.getInput('progmem-bytes-treshold'));
    const progmemPercentageTreshold = parseNumberOrNull(core.getInput('progmem-percentage-treshold'));
    const ramBytesTreshold = parseNumberOrNull(core.getInput('ram-bytes-treshold'));
    const ramPercentageTreshold = parseNumberOrNull(core.getInput('ram-percentage-treshold'));
    const ramRemainedTreshold = parseNumberOrNull(core.getInput('ram-remained-treshold'));

    const { progmemBytes, progmemPercentage, progmemTotal } = parseProgmemUsage(compileLog);
    const { ramBytes, ramPercentage, ramRemained, ramTotal } = parseRAMUsage(compileLog);

    const progmemBytesExceeded = progmemBytesTreshold != null && (progmemBytes == null || progmemBytes > progmemBytesTreshold);
    const progmemPercentageExceeded = progmemPercentageTreshold != null && (progmemPercentage == null || progmemPercentage > progmemPercentageTreshold);
    const ramBytesExceeded = ramBytesTreshold != null && (ramBytes == null || ramBytes > ramBytesTreshold);
    const ramPercentageExceeded = ramPercentageTreshold != null && (ramPercentage == null || ramPercentage > ramPercentageTreshold);
    const ramRemainedExceeded = ramRemainedTreshold != null && (ramRemained == null || ramRemained < ramRemainedTreshold);

    setNumericOutput('progmem-bytes', progmemBytes);
    setBooleanOutput('progmem-bytes-exceeded', progmemBytesExceeded);
    setNumericOutput('progmem-percentage', progmemPercentage);
    setBooleanOutput('progmem-percentage-exceeded', progmemPercentageExceeded);
    setNumericOutput('progmem-total', progmemTotal);

    setNumericOutput('ram-bytes', ramBytes);
    setBooleanOutput('ram-bytes-exceeded', ramBytesExceeded);
    setNumericOutput('ram-percentage', ramPercentage);
    setBooleanOutput('ram-percentage-exceeded', ramPercentageExceeded);
    setNumericOutput('ram-remained', ramRemained);
    setBooleanOutput('ram-remained-exceeded', ramRemainedExceeded);
    setNumericOutput('ram-total', ramTotal);
} catch (error) {
    core.setFailed(error.message);
}
