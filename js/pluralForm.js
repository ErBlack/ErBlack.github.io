module.exports = function pluralForm(n, f) {
    n %= 100;
    if (n > 10 && n < 20) {
        return f[2];
    }

    n %= 10;

    return f[n > 1 && n < 5 ? 1 : n == 1 ? 0 : 2];
}