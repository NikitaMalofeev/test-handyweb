module.exports = {
    images: {
        domains: ["fakestoreapi.com"],
    },
    async redirects() {
        return [
            {
                source: "/",
                destination: "/catalog-page",
                permanent: true,
            },
        ];
    },
};
