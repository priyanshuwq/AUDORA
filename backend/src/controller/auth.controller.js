import { User } from "../models/user.model.js";

export const authCallback = async (req, res, next) => {
	try {
		const { id, firstName, lastName, imageUrl } = req.body;

		// Validate required fields
		if (!id) {
			return res.status(400).json({ 
				success: false, 
				message: "User ID is required" 
			});
		}

		// check if user already exists
		let user = await User.findOne({ clerkId: id });

		if (!user) {
			// signup - create new user with retry logic
			try {
				user = await User.create({
					clerkId: id,
					fullName: `${firstName || ""} ${lastName || ""}`.trim() || "User",
					imageUrl: imageUrl || "",
				});
				console.log(`✓ New user created: ${user.fullName} (${id})`);
			} catch (createError) {
				// Handle duplicate key error (race condition)
				if (createError.code === 11000) {
					user = await User.findOne({ clerkId: id });
					console.log(`✓ User already exists (race condition): ${id}`);
				} else {
					throw createError;
				}
			}
		} else {
			// Update existing user info if changed
			let updated = false;
			const newFullName = `${firstName || ""} ${lastName || ""}`.trim();
			
			if (newFullName && user.fullName !== newFullName) {
				user.fullName = newFullName;
				updated = true;
			}
			
			if (imageUrl && user.imageUrl !== imageUrl) {
				user.imageUrl = imageUrl;
				updated = true;
			}
			
			if (updated) {
				await user.save();
				console.log(`✓ User updated: ${user.fullName} (${id})`);
			}
		}

		res.status(200).json({ 
			success: true,
			user: {
				id: user._id,
				clerkId: user.clerkId,
				fullName: user.fullName,
				imageUrl: user.imageUrl
			}
		});
	} catch (error) {
		console.error("❌ Error in auth callback:", error.message);
		
		// Don't expose internal errors to client
		res.status(500).json({ 
			success: false, 
			message: "Authentication failed. Please try again." 
		});
	}
};
