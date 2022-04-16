export const delay = (delay: number) => {
    return new Promise(function (resolve) {
        setTimeout(resolve, delay);
    });
};
