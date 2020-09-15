/********************************************************************************
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

export const envVariablesPath = '/services/envs';

export const EnvVariablesServer = Symbol('EnvVariablesServer');
export interface EnvVariablesServer {
    getExecPath(): Promise<string>
    getVariables(): Promise<EnvVariable[]>
    getValue(key: string): Promise<EnvVariable | undefined>
    getConfigDirUri(): Promise<string>;
    /**
     * Resolves to a URI representing the current user's home directory.
     */
    getHomeDirUri(): Promise<string>;
    /**
     * Resolves to an array of URIs pointing to the available drives on the filesystem.
     */
    getDrives(): Promise<string[]>;
    /**
     * Gets all environment variable collections.
     */
    readonly collections: Map<string, EnvironmentVariableCollection>;
    /**
     * Gets a single collection constructed by merging all environment variable collections into
     * one.
     */
    readonly mergedCollection: MergedEnvironmentVariableCollection;
    /**
     * Sets an extension's environment variable collection.
     */
    set(extensionIdentifier: string, persistent: boolean, collection: SerializableEnvironmentVariableCollection): void;
    /**
     * Deletes an extension's environment variable collection.
     */
    delete(extensionIdentifier: string): void;
}

export interface EnvVariable {
    readonly name: string
    readonly value: string | undefined
}

export interface EnvironmentVariableCollection {
    readonly map: ReadonlyMap<string, EnvironmentVariableMutator>;
}

export interface EnvironmentVariableCollectionWithPersistence extends EnvironmentVariableCollection {
    readonly persistent: boolean;
}

export enum EnvironmentVariableMutatorType {
    Replace = 1,
    Append = 2,
    Prepend = 3
}

export interface EnvironmentVariableMutator {
    readonly value: string;
    readonly type: EnvironmentVariableMutatorType;
}

export interface ExtensionOwnedEnvironmentVariableMutator extends EnvironmentVariableMutator {
    readonly extensionIdentifier: string;
}

/**
 * Represents an environment variable collection that results from merging several collections
 * together.
 */
export interface MergedEnvironmentVariableCollection {
    readonly map: ReadonlyMap<string, ExtensionOwnedEnvironmentVariableMutator[]>;

    /**
     * Applies this collection to a process environment.
     */
    applyToProcessEnvironment(env: { [key: string]: string | null } ): void;
}

export type SerializableEnvironmentVariableCollection = [string, EnvironmentVariableMutator][];

