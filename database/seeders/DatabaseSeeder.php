<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'affiliate']);
        Role::firstOrCreate(['name' => 'mentor']);
        Role::firstOrCreate(['name' => 'user']);

        $admin = User::factory()->create([
            'name' => 'Admin',
            'email' => 'arsacendekia@gmail.com',
            'phone_number' => '082241477053',
            'bio' => 'Admin Arsa Cendekia',
            'password' => bcrypt('Bersinergi07'),
        ]);

        $adminAffiliate = User::factory()->create([
            'name' => 'Arsa Affiliate',
            'email' => 'arsa@gmail.com',
            'phone_number' => '082241477053',
            'bio' => "Arsa Affiliate's Bio",
            'password' => bcrypt('Bersinergi07'),
            'affiliate_code' => 'ARS2025',
            'affiliate_status' => 'Active',
            'commission' => 15,
        ]);

        $admin->assignRole('admin');
        $adminAffiliate->assignRole('affiliate');

        $this->call([
            ToolSeeder::class,
            CategorySeeder::class,
        ]);
    }
}
