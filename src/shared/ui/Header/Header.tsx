import { Input } from "antd";
import { useState, useCallback, useEffect, useRef } from "react";
import { RootState, useAppDispatch, useAppSelector } from "@/app/store/store";
import { fetchSearchProducts } from "@/entities/catalog/slice/catalogSlice";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import styles from "./styles.module.scss";
import { searchDebounce } from "@/shared/helpers/searchDebounce";
import HeartOutlined from "@ant-design/icons/lib/icons/HeartOutlined";
import ArrowLeftOutlined from "@ant-design/icons/lib/icons/ArrowLeftOutlined";
import Image from "next/image";

const { Search } = Input;

export const Header = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { searchingProducts } = useAppSelector((state: RootState) => state.catalog);
    const [searchQuery, setSearchQuery] = useState("");
    const [showResults, setShowResults] = useState(false);
    const searchResultRef = useRef<HTMLDivElement>(null);

    const debouncedSearch = useCallback(
        searchDebounce((value: string) => {
            dispatch(fetchSearchProducts(value));
        }),
        [dispatch]
    );

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchQuery(value);
        debouncedSearch(value);
        if (value) {
            setShowResults(true);
        }
    };

    const handleProductClick = (id: number) => {
        router.push(`/product/${id}`);
        setShowResults(false);
    };

    const handleFocus = () => {
        if (searchQuery) {
            setShowResults(true);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchResultRef.current && !searchResultRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchResultRef]);

    const isNoFavoritePage = router.pathname !== "/favorite-page"

    return (
        <div className={styles.header}>
            <Search
                placeholder="Search products"
                onChange={handleSearch}
                onFocus={handleFocus}
                value={searchQuery}
                enterButton
                style={{ width: 200, marginLeft: 20 }}
            />

            {isNoFavoritePage ? (
                <Link href="/favorite-page" style={{ textDecoration: "none", color: "black", display: "flex", gap: "8px" }}>
                    <span>Favorites</span>
                    <HeartOutlined />
                </Link>
            ) : (

                <Link href="/" style={{ textDecoration: "none", color: "black", display: "flex", gap: "8px" }}>
                    <ArrowLeftOutlined />
                    <span>Back to Catalog</span>
                </Link>
            )}

            <motion.div
                className={styles.search__results}
                ref={searchResultRef}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: showResults ? 1 : 0, height: showResults ? "auto" : 0 }}
                transition={{ duration: 0.3 }}
            >
                {searchQuery && showResults && (
                    <div className={styles.search__result__container}>
                        {searchingProducts.length > 0 ? (
                            searchingProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className={styles.search__result__item}
                                    onClick={() => handleProductClick(product.id)}
                                >
                                    <Image src={product.image} alt={product.title} width={50} height={50} />
                                    <span>{product.title}</span>
                                </div>
                            ))
                        ) : (
                            <div>No products found</div>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
};
