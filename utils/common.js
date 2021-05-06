getDate = (date) => {
    let dobArray = date.split('/');
    let day = parseInt(dobArray[0]) + 1;
    let month = parseInt(dobArray[1] - 1);
    let year = parseInt(dobArray[2]);
    return new Date(year, month, day);
}

exports.getDate = getDate;