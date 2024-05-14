-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 06, 2024 at 09:32 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecommerce`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `CalculateCartTotal` (IN `cartID` INT, OUT `totalAmount` DECIMAL(10,2))   BEGIN
    SELECT SUM(cd.priceEach * cd.quantity) INTO totalAmount
    FROM cartdetails cd
    JOIN carts c ON c.cart_id = cd.cart_id
    WHERE c.cart_id = cartID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `CalculateOrderTotal` (IN `orderId` INT, OUT `totalAmount` DECIMAL(10,2))   BEGIN
    SELECT SUM(priceEach * quantityOrdered) INTO totalAmount
    FROM orderdetails od
    JOIN orders o on o.order_id = od.order_id
    GROUP BY order_id
    HAVING order_id = orderId;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

CREATE TABLE `address` (
  `address_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `country` varchar(45) NOT NULL,
  `city` varchar(45) NOT NULL,
  `province` varchar(45) DEFAULT NULL,
  `address` varchar(255) NOT NULL,
  `primary` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `address`
--

INSERT INTO `address` (`address_id`, `user_id`, `country`, `city`, `province`, `address`, `primary`) VALUES
(7, 1, 'Vietnam', 'Hanoi', 'Cau Giay', '144 Xuan Thuy', 0),
(8, 1, 'Virgin Island', 'Ohio ', 'Dive', '727 dude', 1),
(9, 3, 'Vietnam', 'Oil', 'Ha Noi', 'Oil Oil', 0),
(10, 3, 'Vietnam', 'Oi', 'Ha Noi', 'Oi Oi', 0),
(11, 1, 'Virgin Island', 'Ohio ', 'Skibidi', 'Toilet', 0);

-- --------------------------------------------------------

--
-- Table structure for table `cartdetails`
--

CREATE TABLE `cartdetails` (
  `cartdetails_id` int(11) NOT NULL,
  `cart_id` int(11) NOT NULL,
  `product_id` varchar(64) NOT NULL,
  `priceEach` float NOT NULL,
  `quantity` smallint(6) NOT NULL,
  `note` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cartdetails`
--

INSERT INTO `cartdetails` (`cartdetails_id`, `cart_id`, `product_id`, `priceEach`, `quantity`, `note`) VALUES
(11, 1, 'products_id_3', 50, 4, 'Size: XL, Color: Ghi'),
(16, 1, 'products_id_3', 50, 5, 'Size: XL, Color: Xanh'),
(17, 1, 'products_id_3', 50, 1, 'Size: L, Color: Ghi'),
(18, 1, 'products_id_3', 50, 2, 'Size: M, Color: Ghi');

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `cart_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `status` smallint(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`cart_id`, `user_id`, `createdAt`, `status`) VALUES
(1, 1, '2024-05-02 21:31:48', 0);

-- --------------------------------------------------------

--
-- Table structure for table `orderdetails`
--

CREATE TABLE `orderdetails` (
  `orderdetails_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` varchar(45) NOT NULL,
  `priceEach` float NOT NULL,
  `quantityOrdered` int(11) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `discount` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` varchar(45) NOT NULL,
  `orderDate` datetime NOT NULL,
  `shippedDate` datetime DEFAULT NULL,
  `cart_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `paymentDate` datetime NOT NULL,
  `amount` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `username` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `phone` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  `admin` tinyint(1) NOT NULL,
  `registeredAt` datetime NOT NULL,
  `lastLogin` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `username`, `email`, `phone`, `password`, `admin`, `registeredAt`, `lastLogin`) VALUES
(1, 'Le', 'Cong Hoang', 'cusnaruto', '22026555@gmail.com', '0727277727', '$2b$10$qhFEJvQ33CkvymciWjxL8.ptktyhn9TIlMM.4Qd1iK337DeGOwoRK', 0, '2024-04-21 21:41:46', '2024-05-07 02:31:13'),
(2, 'Hoang', 'Cong', 'hoang', 'nibix39919@dxice.com', '', '$2b$10$40L5mWX.hA6giwhiYWiGMuCTTQEEDmnWDR.T0Nl.B9Aeo/J4dB5He', 0, '2024-04-29 19:56:37', NULL),
(3, NULL, NULL, 'thangman', 'hohoho@gmail.com', '', '$2b$10$IZ0jJDoeo9JVWZUEqPtC3.TtDSpAVf02sC0/QlxwOkn/qTS9QV5TW', 0, '2024-04-29 20:10:37', '2024-05-06 23:23:47'),
(4, 'Rob', 'Bank', 'thang', 'ngotband@gmial.com', '', '$2b$10$dpLEbXeloum84PLEbsyyXuDEyC1nfzvHGat9LgZSFTas7vUY9wLz2', 0, '2024-04-29 20:11:30', '2024-04-29 20:31:40'),
(5, 'FDSFDS', 'fvdsvxcvc', 'cusnaaarutooo', 'hoang3332@gmail.com', '', '$2b$10$OSSS7XKf1EEA59lamWGjmuCBe1aDOXBNxVLvyn.lrTm3omKhAb9i6', 0, '2024-04-29 20:47:02', '2024-04-29 20:47:15'),
(6, 'Le', 'Cong Hoangf', 'whatthefuckkkk', 'nibix39919@dxice.com.vn', '', '$2b$10$41LT/Lt8xv1o6NvPq0o99e3LGB8QqqL7JjoH4fa6In4wzqnVuF4XK', 0, '2024-04-29 20:48:14', '2024-04-29 20:54:30'),
(7, 'fumo', 'enjoyer', 'fumo', 'fumofumo@gmail.com', '', '$2b$10$hDsqTNJ3cPaGxKx5yaF0v.l.qmmIMX.s2Rc7eNHfn7WrjSK8wYCj2', 0, '2024-04-29 20:53:09', NULL),
(8, 'fumoman', 'man', 'fumofumofumo', 'fumoje@gmail.com', '', '$2b$10$Q1rv6SQUXPro8bAE12dRDOppmSQ3/emxE5D4Zlcn2eiDDkdDxXusu', 0, '2024-04-29 20:55:15', '2024-04-29 20:57:09'),
(9, 'lele', 'le fdfd', 'cusnarutoooo', 'cusnaruto@gmail.com', '', '$2b$10$al2Ish9HHEEYokRu82FvkehicCfi.Q7yd9gV5TeUuKL7V/QgwYtkC', 0, '2024-04-29 20:59:17', NULL),
(10, 'Man', 'im cooked', 'cookedman', 'cookeddud@gmail.com', '', '$2b$10$H0JD7ngCWZCSzJIErhLLt.oHN09EWT7y2HQx/DPyOv4doI5qKZes2', 0, '2024-05-03 23:11:58', '2024-05-03 23:12:38'),
(11, 'This', 'Dude', 'iscookedfr', 'lihah6879@agafx.com', '0977843222', '$2b$10$OBL/CowRLYHUPgSD12KS0OHlPGKBb1PWYKS/SIFMZEUpz0xlx1jsW', 0, '2024-05-03 23:15:44', NULL);

-- --------------------------------------------------------

--
-- Stand-in structure for view `user_cart_view`
-- (See below for the actual view)
--
CREATE TABLE `user_cart_view` (
`user_id` int(11)
,`email` varchar(45)
,`cart_id` int(11)
,`card_status` smallint(6)
,`product_id` varchar(64)
,`quantity` smallint(6)
,`priceEach` float
,`cartdetails_id` int(11)
,`note` varchar(255)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `user_orders_view`
-- (See below for the actual view)
--
CREATE TABLE `user_orders_view` (
`user_id` int(11)
,`email` varchar(45)
,`order_id` int(11)
,`order_status` varchar(45)
,`orderDate` datetime
,`shippedDate` datetime
,`product_id` varchar(45)
,`product_price` float
,`quantityOrdered` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `user_profile_view`
-- (See below for the actual view)
--
CREATE TABLE `user_profile_view` (
`user_id` int(11)
,`email` varchar(45)
,`first_name` varchar(45)
,`last_name` varchar(45)
,`phone` varchar(45)
,`order_count` bigint(21)
,`address_id` int(11)
,`country` varchar(45)
,`city` varchar(45)
,`province` varchar(45)
,`address` varchar(255)
);

-- --------------------------------------------------------

--
-- Structure for view `user_cart_view`
--
DROP TABLE IF EXISTS `user_cart_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `user_cart_view`  AS SELECT `u`.`user_id` AS `user_id`, `u`.`email` AS `email`, `c`.`cart_id` AS `cart_id`, `c`.`status` AS `card_status`, `cd`.`product_id` AS `product_id`, `cd`.`quantity` AS `quantity`, `cd`.`priceEach` AS `priceEach`, `cd`.`cartdetails_id` AS `cartdetails_id`, `cd`.`note` AS `note` FROM ((`users` `u` join `carts` `c` on(`u`.`user_id` = `c`.`user_id`)) join `cartdetails` `cd` on(`c`.`cart_id` = `cd`.`cart_id`)) ;

-- --------------------------------------------------------

--
-- Structure for view `user_orders_view`
--
DROP TABLE IF EXISTS `user_orders_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `user_orders_view`  AS SELECT `u`.`user_id` AS `user_id`, `u`.`email` AS `email`, `o`.`order_id` AS `order_id`, `o`.`status` AS `order_status`, `o`.`orderDate` AS `orderDate`, `o`.`shippedDate` AS `shippedDate`, `od`.`product_id` AS `product_id`, `od`.`priceEach` AS `product_price`, `od`.`quantityOrdered` AS `quantityOrdered` FROM ((`users` `u` join `orders` `o` on(`u`.`user_id` = `o`.`user_id`)) left join `orderdetails` `od` on(`o`.`order_id` = `od`.`order_id`)) ;

-- --------------------------------------------------------

--
-- Structure for view `user_profile_view`
--
DROP TABLE IF EXISTS `user_profile_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `user_profile_view`  AS SELECT `u`.`user_id` AS `user_id`, `u`.`email` AS `email`, `u`.`first_name` AS `first_name`, `u`.`last_name` AS `last_name`, `u`.`phone` AS `phone`, count(`o`.`order_id`) AS `order_count`, `a`.`address_id` AS `address_id`, `a`.`country` AS `country`, `a`.`city` AS `city`, `a`.`province` AS `province`, `a`.`address` AS `address` FROM ((`users` `u` left join `orders` `o` on(`u`.`user_id` = `o`.`user_id`)) left join `address` `a` on(`u`.`user_id` = `a`.`user_id`)) WHERE `a`.`primary` = 1 GROUP BY `u`.`user_id` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`address_id`) USING BTREE,
  ADD KEY `fk_addresses_users_user_id _idx` (`user_id`);

--
-- Indexes for table `cartdetails`
--
ALTER TABLE `cartdetails`
  ADD PRIMARY KEY (`cartdetails_id`),
  ADD KEY `fk_cartdetails_cart_cartid` (`cart_id`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `fk_cart_user_userid_idx` (`user_id`);

--
-- Indexes for table `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD PRIMARY KEY (`orderdetails_id`),
  ADD KEY `fk_orderdetails_orders_orderid` (`order_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `fk_order_user_userId_idx` (`user_id`),
  ADD KEY `fk_order_cart_cartid_idx` (`cart_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`user_id`,`payment_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `address`
--
ALTER TABLE `address`
  MODIFY `address_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `cartdetails`
--
ALTER TABLE `cartdetails`
  MODIFY `cartdetails_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `orderdetails`
--
ALTER TABLE `orderdetails`
  MODIFY `orderdetails_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `address`
--
ALTER TABLE `address`
  ADD CONSTRAINT `fk_addresses_users_user_id ` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `cartdetails`
--
ALTER TABLE `cartdetails`
  ADD CONSTRAINT `fk_cartdetails_cart_cartid` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`cart_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `fk_cart_user_userid` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD CONSTRAINT `fk_orderdetails_order_orderid` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_order_cart_cartid` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`cart_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_order_user_userId` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `fk_payment_user_userid` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
