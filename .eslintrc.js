module.exports = {
    parser: 'babel-eslint',
    extends: ['airbnb-base'],
    rules: {
        indent: [
            'error',
            4,
            {
                SwitchCase: 1,
            },
        ],
        'lines-between-class-members': [0]
    },
};
