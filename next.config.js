module.exports = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/catalog-page',
                permanent: true,
            },
        ];
    },
};
